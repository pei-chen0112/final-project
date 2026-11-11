"""
計算第 7 章「實證結果」的數據，並輸出 test/report_ch7.md

    python score_test.py                 # 讀 test/ 底下的檔案
    python score_test.py --dir 其他資料夾

需要的檔案（缺哪個，對應的小節就標為「尚未完成」）：
  7.2 單張影像分類
    test/human/labels_*.csv        每位組員用 label_test.html 匯出的盲測標註
    test/human/final.csv           （多人標註且有分歧時）討論後的最終類別：test_id,final_grade
    test/_sealed/predictions.csv   標註前就封存的模型預測
  7.3 回收申請案件
    test/cases/case_labels.csv     組員在執行測試前填寫的人工參考判定：case_id,human_verdict（合格／待確認／不合格）
    test/cases/case_results.csv    website/case_test.html 匯出的系統判定
"""
import argparse
import csv
import hashlib
import sys
from collections import Counter
from pathlib import Path

GRADES = ["A", "B", "C", "D", "X"]
GRADE_ZH = {"A": "A 良好", "B": "B 輕微磨損", "C": "C 中度磨損", "D": "D 嚴重損壞", "X": "X 不適用或無法判讀"}
VERDICT = {"合格": "pass", "待確認": "review", "不合格": "fail", "pass": "pass", "review": "review", "fail": "fail"}
VERDICT_ZH = {"pass": "合格", "review": "待確認", "fail": "不合格"}


def read_csv(path):
    with open(path, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def pct(a, b):
    return f"{a / b * 100:.1f}" if b else "—"


def check_seal(root):
    seal = root / "_sealed" / "SEAL.txt"
    pred = root / "_sealed" / "predictions.csv"
    if not seal.exists() or not pred.exists():
        return "（找不到封存紀錄）"
    want = next((l.split()[0] for l in seal.read_text(encoding="utf-8").splitlines() if l.endswith("predictions.csv")), None)
    got = hashlib.sha256(pred.read_bytes()).hexdigest()
    return "預測檔與封存雜湊一致，標註後未被修改" if want == got else "⚠ 預測檔與封存雜湊不一致，請確認是否被修改"


# ---------------------------------------------------------------- 7.2
def single_image(root, out):
    files = sorted((root / "human").glob("labels_*.csv"))
    pred_path = root / "_sealed" / "predictions.csv"
    if not files or not pred_path.exists():
        out.append("## 7.2 單張影像分類結果\n\n本次單張影像測試狀態為【尚未完成】（找不到組員標註或模型預測）。\n")
        return None

    by_labeler = {}
    for f in files:
        rows = read_csv(f)
        name = (rows[0].get("labeler") if rows else "") or f.stem.removeprefix("labels_")
        by_labeler[name] = {r["test_id"]: r["grade"].strip().upper() for r in rows if r["grade"].strip()}
    labelers = list(by_labeler)
    ids = sorted(set().union(*[set(v) for v in by_labeler.values()]))

    final_path = root / "human" / "final.csv"
    final = {r["test_id"]: r["final_grade"].strip().upper() for r in read_csv(final_path)} if final_path.exists() else {}

    truth, disagree, all_agree = {}, [], 0
    for i in ids:
        gs = [by_labeler[n].get(i) for n in labelers]
        gs_known = [g for g in gs if g]
        if len(gs_known) < len(labelers):
            disagree.append((i, gs, "有人未標註"))
            continue
        if len(set(gs_known)) == 1:
            all_agree += 1
            truth[i] = gs_known[0]
        elif final.get(i) in GRADES:
            truth[i] = final[i]
        else:
            disagree.append((i, gs, ""))
    if final:  # final.csv 可覆寫任何一張
        truth.update({i: g for i, g in final.items() if g in GRADES})
        disagree = [d for d in disagree if d[0] not in truth]

    if disagree:
        p = root / "human" / "disagreements.csv"
        with open(p, "w", newline="", encoding="utf-8-sig") as f:
            w = csv.writer(f)
            w.writerow(["test_id", *labelers, "final_grade"])
            for i, gs, _ in disagree:
                w.writerow([i, *[g or "" for g in gs], ""])
        print(f"⚠ 有 {len(disagree)} 張標註不一致或未完成，已列在 {p}。")
        print("  請組員討論後，把最終類別填進 final_grade 欄，另存成 test/human/final.csv（欄位 test_id,final_grade），再重跑一次。")
        out.append(f"## 7.2 單張影像分類結果\n\n本次單張影像測試狀態為【尚未完成】：尚有 {len(disagree)} 張標註分歧待討論。\n")
        return None

    preds = {r["test_id"]: r["pred"] for r in read_csv(pred_path)}
    ids = [i for i in ids if i in preds]
    n = len(ids)
    cm = {g: Counter() for g in GRADES}
    for i in ids:
        cm[truth[i]][preds[i]] += 1
    count = {g: sum(cm[g].values()) for g in GRADES}
    correct = sum(cm[g][g] for g in GRADES)
    d_total, d_to_ab = count["D"], cm["D"]["A"] + cm["D"]["B"]
    confusions = sorted(((cm[t][p], t, p) for t in GRADES for p in GRADES if t != p and cm[t][p]), reverse=True)
    top = confusions[0] if confusions else None

    agree_txt = ""
    if len(labelers) > 1:
        agree_txt = f"（{len(labelers)} 位組員初次標註完全一致 {all_agree} 張，一致率 {pct(all_agree, n)}%；其餘經討論覆核決定）"

    lines = ["## 7.2 單張影像分類結果", "",
             f"本次單張影像測試狀態為【已完成】{agree_txt}。測試資料中，"
             + "、".join(f"{g} 類【{count[g]}】張" for g in GRADES)
             + f"。模型預測與人工參考類別相同的影像共【{correct}】張，整體分類正確率為【{pct(correct, n)}】%。", ""]
    if d_total:
        lines += [f"人工參考標註為 D 類的【{d_total}】張影像中，有【{d_to_ab}】張被判為 A 或 B，比例為【{pct(d_to_ab, d_total)}】%。", ""]
    else:
        lines += ["本次測試未包含人工標註為 D 類的影像，故不計算 D 類被判為 A 或 B 的比例。", ""]
    if top:
        lines += [f"本次最常見的分類混淆為【人工標註 {GRADE_ZH[top[1]]}，模型判為 {GRADE_ZH[top[2]]}，共 {top[0]} 張】，"
                  "代表性影像的共同特徵為【請組員檢視下列影像後填寫】。", ""]
        examples = [i for i in ids if truth[i] == top[1] and preds[i] == top[2]]
        lines += [f"（此混淆的影像：{', '.join(examples)}）", ""]

    lines += ["### 各類別辨識情形（召回率）", "", "| 人工類別 | 張數 | 判對 | 召回率 |", "|---|---|---|---|"]
    lines += [f"| {GRADE_ZH[g]} | {count[g]} | {cm[g][g]} | {pct(cm[g][g], count[g])}% |" for g in GRADES]
    lines += ["", "### 混淆矩陣（列：人工參考，欄：模型預測）", "",
              "| 人工＼模型 | " + " | ".join(GRADES) + " | 合計 |", "|---" * (len(GRADES) + 2) + "|"]
    lines += [f"| {g} | " + " | ".join(str(cm[g][p]) for p in GRADES) + f" | {count[g]} |" for g in GRADES]
    lines += ["", f"封存檢查：{check_seal(root)}。", ""]
    out += lines
    return {"n": n, "labelers": len(labelers)}


# ---------------------------------------------------------------- 7.3
def cases(root, out):
    lab_p, res_p = root / "cases" / "case_labels.csv", root / "cases" / "case_results.csv"
    if not lab_p.exists() or not res_p.exists():
        out.append("## 7.3 回收申請案件判定結果\n\n本次案件評估狀態為【尚未完成】（找不到案件人工判定或系統結果）。\n")
        return None
    human = {r["case_id"].strip(): VERDICT.get(r["human_verdict"].strip()) for r in read_csv(lab_p)}
    bad = [k for k, v in human.items() if v is None]
    if bad:
        sys.exit(f"case_labels.csv 的 human_verdict 只能填 合格／待確認／不合格，有問題的案件：{bad}")
    res = {r["case_id"].strip(): r for r in read_csv(res_p)}
    n = len(res)
    ok = lambda r, m: r.get(f"{m}_status") == "ok"
    done = {m: sum(ok(r, m) for r in res.values()) for m in ("claude", "local", "hybrid")}
    common = [c for c, r in res.items() if all(ok(r, m) for m in ("claude", "local", "hybrid")) and c in human]
    agree = {m: sum(res[c][f"{m}_verdict"] == human[c] for c in common) for m in ("claude", "local", "hybrid")}
    hy_ok = [r for r in res.values() if ok(r, "hybrid")]
    hv = Counter(r["hybrid_verdict"] for r in hy_ok)
    failed = n - len(hy_ok)
    labeled_hy = [c for c, r in res.items() if ok(r, "hybrid") and c in human]
    false_reject = sum(human[c] in ("pass", "review") and res[c]["hybrid_verdict"] == "fail" for c in labeled_hy)
    false_accept = sum(human[c] == "fail" and res[c]["hybrid_verdict"] == "pass" for c in labeled_hy)

    lines = ["## 7.3 回收申請案件判定結果", "",
             f"本次案件評估狀態為【已完成】，共測試【{n}】件。Claude 單獨分析完成【{done['claude']}】件，"
             f"自建模型單獨判定完成【{done['local']}】件，混合判定完成【{done['hybrid']}】件。"
             f"模式間比較僅採用各模式均完成分析、且具共同人工參考判定的案件，共計【{len(common)}】件。", "",
             f"混合判定結果中，合格【{hv['pass']}】件、待確認【{hv['review']}】件、不合格【{hv['fail']}】件；"
             f"另有【{failed}】件因服務錯誤或其他原因未完成分析。", "",
             f"在共同完成分析的案件中，Claude、自建模型及混合判定與人工參考判定的一致率分別為"
             f"【{pct(agree['claude'], len(common))}】%、【{pct(agree['local'], len(common))}】%及【{pct(agree['hybrid'], len(common))}】%。", "",
             f"混合判定的待確認比例為【{pct(hv['review'], len(hy_ok))}】%。", "",
             f"此外，人工參考判定為可進入後續審核，卻被系統判為不合格的案件共【{false_reject}】件；"
             f"人工參考判定為不合格，卻被系統判為合格的案件共【{false_accept}】件。", "",
             "注意：目前網站的混合規則在自建模型有結果時一律採用自建模型判定（Claude 僅供參考），"
             "因此混合判定與自建模型單獨判定的結果相同，且不會產生「待確認」。", "",
             "### 逐案明細", "", "| 案件 | 人工 | Claude | 自建模型 | 混合 | 備註 |", "|---|---|---|---|---|---|"]
    for c, r in sorted(res.items()):
        v = lambda m: (VERDICT_ZH.get(r.get(f"{m}_verdict"), "") + (f" {r.get(f'{m}_score')}" if r.get(f"{m}_score") else "")) if ok(r, m) else "失敗"
        lines.append(f"| {c} | {VERDICT_ZH.get(human.get(c), '未標')} | {v('claude')} | {v('local')} | {v('hybrid')} | {r.get('error_note', '')} |")
    lines.append("")
    out += lines
    return {"n": n}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", default=str(Path(__file__).parent / "test"))
    root = Path(ap.parse_args().dir)
    out = ["# 第 7 章實證數據（由 score_test.py 自動產生）", ""]
    single_image(root, out)
    cases(root, out)
    report = root / "report_ch7.md"
    report.write_text("\n".join(out), encoding="utf-8")
    print("\n".join(out))
    print(f"\n已寫入 {report}")


if __name__ == "__main__":
    main()
