"""
建立正式測試集（第 7 章單張影像分類測試用）

從 raw/ 裡「沒有拿去訓練」的照片中，依來源分類分層抽樣，複製到 test/images/，
並重新命名為 T001.jpg、T002.jpg…，讓標註的組員看不到原始檔名與分類提示。

    python make_test_set.py            # 預設抽 120 張，亂數種子 20261111（可重現）
    python make_test_set.py --seed 1   # 換一組

產生的檔案：
    test/images/T001.jpg …          給組員盲測標註的照片（長邊縮到 1024 px）
    test/images.json / images.js     照片清單（標註工具讀 images.js）
    test/_sealed/manifest.csv        測試編號 ↔ 原始檔名、來源分類、作者與授權（標註完成前不要打開）
"""
import argparse
import csv
import json
import random
import shutil
from pathlib import Path

HERE = Path(__file__).parent
RAW, LABELED, TEST = HERE / "raw", HERE / "labeled", HERE / "test"

# 分層：(名稱, 判斷函式, 抽幾張)。整車 C/D 與零件 C/D 抽多一點，確保 D 類有足夠樣本
STRATA = [
    ("整車 C/D",   lambda h: h == "C/D",   35),
    ("整車 A/B/C", lambda h: h == "A/B/C", 15),
    ("整車 A/B",   lambda h: h == "A/B",   15),
    ("非目標 X",   lambda h: h == "X",     15),
    ("特寫 C/D",   lambda h: h.startswith("特寫 C"), 20),
    ("特寫 A/B",   lambda h: h.startswith("特寫 A/B"), 20),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--seed", type=int, default=20261111)
    ap.add_argument("--force", action="store_true", help="test/ 已存在時覆蓋")
    args = ap.parse_args()

    if TEST.exists():
        if not args.force:
            raise SystemExit("test/ 已存在。若確定要重建（會刪掉既有標註），請加 --force")
        shutil.rmtree(TEST)

    with open(HERE / "labels.csv", encoding="utf-8-sig") as f:
        labeled = {r["file"] for r in csv.DictReader(f)}
    trained = {p.name for p in LABELED.rglob("*") if p.is_file()}
    with open(HERE / "sources.csv", encoding="utf-8-sig") as f:
        sources = {r["file"]: r for r in csv.DictReader(f)}

    unseen = sorted(p.name for p in RAW.iterdir()
                    if p.is_file() and p.name not in labeled and p.name not in trained and p.name in sources)
    rng = random.Random(args.seed)
    picked = []
    for name, match, n in STRATA:
        pool = [f for f in unseen if match(sources[f]["hint"])]
        take = rng.sample(pool, min(n, len(pool)))
        print(f"{name:10s} 候選 {len(pool):4d} 張，抽 {len(take)} 張")
        picked += [(f, name) for f in take]
    rng.shuffle(picked)  # 打亂順序，避免同一類照片連在一起

    try:
        from PIL import Image
    except ImportError:
        Image = None
        print("（沒有 Pillow，照片以原檔複製）")

    (TEST / "images").mkdir(parents=True)
    (TEST / "_sealed").mkdir()
    (TEST / "human").mkdir()
    ids = []
    with open(TEST / "_sealed" / "manifest.csv", "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(["test_id", "file", "stratum", "category", "hint", "author", "license", "page_url"])
        for i, (file, stratum) in enumerate(picked, 1):
            tid = f"T{i:03d}"
            dst = TEST / "images" / f"{tid}.jpg"
            if Image:
                im = Image.open(RAW / file).convert("RGB")
                im.thumbnail((1024, 1024))
                im.save(dst, quality=90)
            else:
                shutil.copy(RAW / file, dst)
            s = sources[file]
            w.writerow([tid, file, stratum, s["category"], s["hint"], s["author"], s["license"], s["page_url"]])
            ids.append(tid)

    (TEST / "images.json").write_text(json.dumps(ids), encoding="utf-8")
    # 給 label_test.html 用（用 <script> 載入，直接雙擊打開 HTML 也能讀到）
    (TEST / "images.js").write_text("window.TEST_IDS = " + json.dumps(ids) + ";", encoding="utf-8")
    print(f"\n完成：{len(ids)} 張測試照片 → {TEST / 'images'}")
    print("請組員打開 label_test.html 盲測標註；標註完成前不要打開 test/_sealed/")


if __name__ == "__main__":
    main()
