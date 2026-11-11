# 正式測試操作說明（第 7 章實證數據）

測試分兩部分，產出的數字由 `score_test.py` 自動計算並套進第 7 章的段落，存成 `test/report_ch7.md`。

> 照片與標註體積大，`test/` 不會上傳 GitHub，請自行備份（例如雲端硬碟）。

---

## 一、單張影像分類測試（7.2）

**已完成的準備**

| 項目 | 說明 |
|---|---|
| 測試照片 | `test/images/T001.jpg`～`T120.jpg`，共 120 張，從 Wikimedia Commons 下載但**沒有拿去訓練**的照片中分層抽樣（`make_test_set.py`，亂數種子 20261111，可重現） |
| 模型預測 | 已在標註前完成並存入 `test/_sealed/predictions.csv`，雜湊值與時間記在 `test/_sealed/SEAL.txt` |
| 對照表 | `test/_sealed/manifest.csv`：測試編號對應的原始檔名、來源分類、作者與授權 |

**組員要做的事**

1. **標註完成前，不要打開 `test/_sealed/` 資料夾**，也不要看網站上這些照片的判定結果。
2. 每位組員各自用瀏覽器打開 `ml-training/label_test.html`（直接雙擊即可），填上自己的代號（如 M1），逐張選等級與可見部位。快捷鍵：1–5 選等級，← → 換張。進度會自動存在瀏覽器裡。
3. 標完按「匯出 CSV」，把 `labels_M1.csv` 放進 `test/human/`。
4. 執行 `python score_test.py`。
   - 若組員之間有分歧，會產生 `test/human/disagreements.csv`。大家討論後在 `final_grade` 欄填入最終類別，另存為 `test/human/final.csv`，再執行一次。
5. 完成後，請依 `report_ch7.md` 列出的混淆影像，回頭看照片，填寫「代表性影像的共同特徵」。

## 二、回收申請案件測試（7.3）

網路上沒有「同一台車的多部位照片」，所以這部分要到校園實拍。建議 5～10 台車，車況盡量涵蓋好、普通、差。

1. **拍照**：每台車建一個資料夾（如 `test/cases/photos/C01/`），照片依部位命名：
   `whole_side.jpg`、`whole_front.jpg`、`frame.jpg`、`wheels.jpg`、`brakes.jpg`、`chain.jpg`、`cockpit.jpg`，其他損壞處用 `extra1.jpg`。
2. **先做人工判定，再跑系統**：在 `test/cases/case_labels.csv` 填寫每台車的人工參考判定（合格／待確認／不合格）。可以看照片，也可以看實車，但**不能先看系統結果**。
3. **跑系統**：用 VS Code Live Server 打開 `website/case_test.html`（網址必須是 `http://localhost:5500` 或 `http://127.0.0.1:5500`）。先在網站用已驗證的 `@g.ncu.edu.tw` 帳號登入，再選 `test/cases/photos/` 資料夾，按「開始測試」。每件會呼叫一次 Claude。
4. 按「匯出結果」，把 `case_results.csv` 與 `case_results.json` 放進 `test/cases/`。
5. 執行 `python score_test.py`。

`case_results.json` 保留了每件的模型原始輸出，可用於 7.4 的案例分析。

## 注意事項

- 目前網站的混合規則是「有自建模型結果就採用自建模型」，所以混合判定會與自建模型單獨判定相同，也不會出現「待確認」。報告會自動註明這一點。
- 測試照片來自網路，與訓練照片同樣來源，部分照片可能來自同一位上傳者的同一組拍攝，這是本測試的限制，可寫在 7.2 最後一段。
