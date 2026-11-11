"""
從 Wikimedia Commons 下載「自由授權」的腳踏車照片，作為訓練資料的補充

為什麼用 Wikimedia Commons？
    Commons 上的照片都是 CC0、公眾領域或 CC BY / CC BY-SA 等自由授權，可以合法拿來訓練模型，
    只要保留作者與授權資訊（本程式會自動記錄在 sources.csv）。
    請不要用爬蟲抓 Google 圖片或一般網站的照片：大多有版權，也違反網站使用條款。

使用方式（PowerShell）：
    python fetch_commons_photos.py --dry-run             # 只列出會下載幾張，不下載
    python fetch_commons_photos.py                       # 下載整台車的照片到 raw/
    python fetch_commons_photos.py --set parts           # 下載零件特寫（車架、輪胎、煞車、鏈條、座墊…）
    python fetch_commons_photos.py --limit 30            # 每個分類最多 30 張

下載後的步驟：
    1. python label_with_claude.py   讓 Claude 預標註（第 5 章）
    2. 人工覆核 labeled/ 裡的照片
    3. Commons 的照片只放訓練資料，不要放進 test/（測試要用真實的學生照片）
"""
import argparse
import csv
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

HERE = Path(__file__).resolve().parent
RAW_DIR = HERE / "raw"
SOURCES_CSV = HERE / "sources.csv"
API = "https://commons.wikimedia.org/w/api.php"
# Wikimedia 要求自動化程式提供可辨識的 User-Agent
USER_AGENT = "NCU-GreenBikes-StudentProject/1.0 (educational bike-condition classifier; https://github.com/pei-chen0112/final-project)"

# 分類：(Commons 分類名稱, 是否包含子分類, 預期等級——僅供參考，最後仍由 Claude + 人工標註, 每類上限或 None=用 --limit)
# whole：整台車的照片（教學檔的「正面照」「側面照」）
WHOLE_BIKE = [
    ("Damaged bicycles", True, "C/D", None),
    ("Abandoned bicycles", True, "C/D", None),
    ("Rusty bicycles", True, "C/D", None),
    ("Parked bicycles", False, "A/B", None),
    ("Bicycle parking in Taiwan", True, "A/B/C", None),
    ("Bicycle parking in Japan", False, "A/B/C", None),
    ("Children's bicycles", False, "X", None),
]
# parts：零件特寫（教學檔的「局部特寫 / 損壞處」），涵蓋 AI 檢查的 6 個部位
# 損壞的特寫數量少，全部下載；正常零件的特寫每類限制 30 張，避免好零件的照片太多
PARTS_CLOSEUP = [
    # 損壞 / 磨損的零件（多半是 C/D）
    ("Damaged bicycle parts", True, "特寫 C/D", 60),
    ("Damaged bicycle wheels", True, "特寫 C/D 輪框", 60),
    ("Damaged bicycle frames", True, "特寫 C/D 車架", 60),
    ("Damaged bicycle saddles", True, "特寫 C/D 座墊", 60),
    ("Bicycle tire repair", False, "特寫 C 輪胎", 40),
    # 正常的零件（多半是 A/B），讓模型也學會「好的零件長什麼樣子」
    ("Bicycle chains", False, "特寫 A/B 鏈條", 30),
    ("Bicycle drivetrains", False, "特寫 A/B 傳動", 30),
    ("Bicycle rim brakes", False, "特寫 A/B 煞車", 30),
    ("Bicycle brake levers", False, "特寫 A/B 煞車把手", 30),
    ("Bicycle brake pads", False, "特寫 A/B 煞車皮", 30),
    ("Bicycle tires", False, "特寫 A/B 輪胎", 30),
    ("Bicycle rims", False, "特寫 A/B 輪框", 30),
    ("Bicycle spokes", False, "特寫 A/B 輻條", 30),
    ("Unidentified bicycle saddles", False, "特寫 A/B 座墊", 30),
    ("Bicycle handlebars", False, "特寫 A/B 把手", 30),
    ("Bicycle pedals", False, "特寫 A/B 踏板", 30),
]
CATEGORY_SETS = {"whole": WHOLE_BIKE, "parts": PARTS_CLOSEUP, "all": WHOLE_BIKE + PARTS_CLOSEUP}
ALLOWED_LICENSE = re.compile(r"^(CC0|Public domain|PD|CC BY(-SA)? [0-9.]+)", re.I)
THUMB_WIDTH = 1024        # 下載縮圖（最長邊約 1024px），省空間也夠訓練用
MIN_SIDE = 400            # 太小的圖片不要


def api(**params):
    params["format"] = "json"
    req = urllib.request.Request(API + "?" + urllib.parse.urlencode(params), headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as res:
        return json.load(res)


def strip_html(text):
    return re.sub(r"<[^>]+>", "", text or "").strip()


def subcategories(category):
    out, cont = [], {}
    while True:
        r = api(action="query", list="categorymembers", cmtitle="Category:" + category, cmtype="subcat", cmlimit=500, **cont)
        out += [m["title"].removeprefix("Category:") for m in r["query"]["categorymembers"]]
        if "continue" not in r:
            return out
        cont = {"cmcontinue": r["continue"]["cmcontinue"]}


def files_in(category, limit):
    """回傳分類中可用的照片資訊（已過濾授權、格式、大小）"""
    found, cont = [], {}
    while len(found) < limit:
        r = api(action="query", generator="categorymembers", gcmtitle="Category:" + category, gcmtype="file", gcmlimit=50,
                prop="imageinfo", iiprop="url|size|mime|extmetadata", iiurlwidth=THUMB_WIDTH, **cont)
        for page in (r.get("query", {}).get("pages", {}) or {}).values():
            info = (page.get("imageinfo") or [{}])[0]
            meta = info.get("extmetadata", {})
            license_name = meta.get("LicenseShortName", {}).get("value", "")
            if info.get("mime") not in ("image/jpeg", "image/png"):
                continue
            if min(info.get("width", 0), info.get("height", 0)) < MIN_SIDE:
                continue
            if not ALLOWED_LICENSE.match(license_name):
                continue
            found.append({
                "pageid": page["pageid"],
                "title": page["title"],
                "thumb": info.get("thumburl") or info.get("url"),
                "page_url": info.get("descriptionurl", ""),
                "author": strip_html(meta.get("Artist", {}).get("value", "")),
                "license": license_name,
                "license_url": meta.get("LicenseUrl", {}).get("value", ""),
            })
        if "continue" not in r:
            break
        cont = {"gcmcontinue": r["continue"]["gcmcontinue"]}
        time.sleep(0.5)
    return found[:limit]


def main():
    parser = argparse.ArgumentParser(description="從 Wikimedia Commons 下載自由授權的腳踏車照片")
    parser.add_argument("--set", choices=list(CATEGORY_SETS), default="whole",
                        help="whole=整台車（預設）、parts=零件特寫、all=全部")
    parser.add_argument("--limit", type=int, default=80, help="每個分類最多幾張（預設 80；零件特寫有各自的上限）")
    parser.add_argument("--dry-run", action="store_true", help="只列出數量，不下載")
    args = parser.parse_args()

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    done = set()
    if SOURCES_CSV.exists():
        with open(SOURCES_CSV, newline="", encoding="utf-8-sig") as f:
            done = {row["file"] for row in csv.DictReader(f)}

    # 1. 收集要下載的照片（不同分類可能有同一張，用 pageid 去除重複）
    todo, seen = [], set()
    for category, recurse, hint, cat_limit in CATEGORY_SETS[args.set]:
        limit = cat_limit or args.limit
        cats = [category] + (subcategories(category) if recurse else [])
        count = 0
        for cat in cats:
            if count >= limit:
                break
            for item in files_in(cat, limit - count):
                if item["pageid"] in seen:
                    continue
                seen.add(item["pageid"])
                item["category"], item["hint"] = cat, hint
                item["file"] = f"commons_{item['pageid']}.jpg"
                if item["file"] not in done:
                    todo.append(item)
                count += 1
        print(f"{category:28s} → {count} 張（預期等級 {hint}）")

    print(f"\n共 {len(todo)} 張要下載（已下載過的 {len(done)} 張會略過），預估約 {len(todo) * 0.2:.0f} MB")
    if args.dry_run or not todo:
        return

    # 2. 下載並記錄來源與授權
    new_file = not SOURCES_CSV.exists()
    with open(SOURCES_CSV, "a", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        if new_file:
            writer.writerow(["file", "title", "page_url", "author", "license", "license_url", "category", "hint"])
        for i, item in enumerate(todo, 1):
            try:
                req = urllib.request.Request(item["thumb"], headers={"User-Agent": USER_AGENT})
                with urllib.request.urlopen(req, timeout=60) as res:
                    data = res.read()
            except Exception as e:  # 單張失敗就略過，不中斷整批
                print(f"[{i}/{len(todo)}] {item['title']}：下載失敗（{e}），略過")
                continue
            (RAW_DIR / item["file"]).write_bytes(data)
            writer.writerow([item["file"], item["title"], item["page_url"], item["author"], item["license"],
                             item["license_url"], item["category"], item["hint"]])
            f.flush()
            print(f"[{i}/{len(todo)}] {item['file']}  {item['license']}  {item['title'][:60]}")
            time.sleep(1)  # 對 Wikimedia 友善一點，不要下載太快

    print(f"\n完成！照片在 {RAW_DIR}，來源與授權記錄在 {SOURCES_CSV}")
    print("下一步：python label_with_claude.py（讓 Claude 預標註），再人工覆核。")


if __name__ == "__main__":
    main()
