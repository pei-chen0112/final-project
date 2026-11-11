# 🚲 中大愛心綠色腳踏車 NCU Green Love Bikes

復活「中央小綠綠」的校園無樁共享單車租借系統（學生專案展示）。

## 執行方式

`script.js` 使用 ES Module，**不能直接雙擊 HTML 開啟**，需要用本機伺服器：

```bash
cd website
python -m http.server 5500
```

然後開啟 <http://localhost:5500/>（`index.html` 會自動轉到 `Eng.html`）。
也可以用 VS Code 的 Live Server 擴充功能。

## 功能

| 角色 | 功能 |
| --- | --- |
| 訪客 | 首頁介紹、地圖查看可租借車輛、捐車規範 / 使用說明 / 常見問題 / 聯絡我們、中英切換、深淺色模式 |
| 學生 | 註冊登入、LINE Pay 模擬儲值、序號兌換、地圖租車（車機動態密碼）、騎乘計時與 GPS 還車、騎乘紀錄、車輛報修、廢棄車回收申請（上傳 3 張照片）、減碳統計與排行榜、修改密碼 |
| 技師 | 審核回收申請（看照片、通過自動發車牌與 $50 獎勵 / 退回附原因）、維修結案上架、車輛上下架、查看使用者意見 |

- **只限中央大學 Google 信箱**：以「帳號@g.ncu.edu.tw」（例如 dkchan@g.ncu.edu.tw）註冊，系統寄驗證信到該信箱，點信中連結完成驗證後才能使用；忘記密碼會寄重設信到學校信箱。其他網域或未驗證的帳號無法登入，也無法使用 AI 檢測服務。
- 技師後台帳號：`admin` / `admin123`（展示用，只在前端比對）
- 測試序號：`SDGS-2024`（$50）、`PROFESSOR-100`（$100），每個帳號各可兌換一次
- 車機密碼每分鐘更新，解鎖視窗中有「模擬車機螢幕」顯示目前密碼

## 🗺️ 車輛線稿與部位照片

- **上傳回收申請**：學生依照每一格的線稿提示，拍攝整體側面、整體正面，以及車架、輪框與輪胎、煞車、鏈條與齒盤、座墊與把手（7 張必拍），另可選填其他損壞處。
- **地圖點車**：右側（手機為底部）會出現該車的線稿藍圖，點選車架、輪子、煞車、鏈條、座墊或把手，就會顯示該部位的照片。沒登入也能看車況，登入後才能解鎖。
- **核准後自動帶入**：技師核准回收申請時，申請的部位照片與 AI 車況分數會存到 `bikePhotos/{車號}`，新車上架後就能在地圖上查看。
- **示範車輛**：NCU-001 ~ NCU-006 的照片來自 Wikimedia Commons（自由授權），網站上會顯示作者與授權。NCU-003 ~ 006 標記為 `demo: true`，正式上線前可以刪除。

## 🤖 AI 車況檢測（回收申請）

學生上傳 3 張照片後，網站會把照片送到 `ai-inspector` 服務，由 Claude 檢查 6 個部位（車架、輪框輪胎、煞車、鏈條傳動、把手座墊、鏽蝕），每個部位 0–100 分，再依權重算出**車況分數**與**損耗率**（= 100 − 車況分數）。

| 結果 | 條件 | 網站行為 |
| --- | --- | --- |
| ✅ 合格 | 車況分數 ≥ 門檻（預設 70） | 可以送出，技師做最終確認 |
| ⚠️ 待確認 | 照片太模糊、看不到車架、可判斷部位太少 | 可以送出，由技師人工判斷 |
| ❌ 不合格 | 分數低於門檻、車架斷裂變形、輪框嚴重變形、電動車、兒童車、不是腳踏車 | 不能送出，請學生換照片或換車 |

部位權重：車架 25%、輪框輪胎 20%、煞車 20%、鏈條傳動 15%、把手座墊 10%、鏽蝕 10%。看不到的部位不計入。
合格與否由程式依固定規則判斷（`ai-inspector/src/index.ts` 的 `decide()`），不是讓 AI 自由決定，所以結果穩定、門檻可調。

### 部署步驟（第一次約 15 分鐘）

1. 安裝 [Node.js](https://nodejs.org/)（LTS 版）。
2. 到 [Claude Console](https://platform.claude.com/) 建立 API Key，並在 Billing 設定**每月花費上限**。
3. 安裝套件並登入 Cloudflare（免費帳號即可）：

   ```bash
   cd ai-inspector
   npm install @anthropic-ai/sdk
   npm install -D wrangler
   npx wrangler login
   ```

4. 設定 API Key（會加密存在 Cloudflare，不會出現在程式碼裡）：

   ```bash
   npx wrangler secret put ANTHROPIC_API_KEY
   ```

5. 編輯 `ai-inspector/wrangler.toml` 的 `ALLOWED_ORIGINS`，加入網站的正式網址（例如 GitHub Pages 網址）。
6. 部署：`npx wrangler deploy`，完成後會顯示網址，例如 `https://ncu-bike-inspector.xxx.workers.dev`。
7. 把這個網址貼到 `website/script.js` 最上方的 `AI_INSPECT_URL`。

`AI_INSPECT_URL` 留空時，網站不使用 AI，申請直接送給技師（和原本一樣）。AI 服務暫時無法使用時也會自動改為人工審核。

### 🧠 自建模型 + Claude 混合判斷

網站已內建自建模型（Teachable Machine）的程式。把匯出的 `model.json`、`metadata.json`、`weights.bin` 放進 `website/model/` 就會自動啟用；資料夾是空的時候自動略過，只用 Claude。

- 模型的類別名稱必須是 `A`（良好）、`B`（輕微磨損）、`C`（中度磨損）、`D`（嚴重損壞）、`X`（無法使用）。
- 兩個模型同時執行，依 9 條規則合併：Claude 發現硬性問題（車架斷裂、電動車…）直接不合格；兩者都合格才合格、都不合格才不合格；意見不同交給技師。
- 最終分數 = Claude × 60% + 自建模型 × 40%。設定在 `website/script.js` 最上方（`PASS_SCORE` 要和 `wrangler.toml` 一致）。
- 從收集照片到訓練的完整步驟見 `docs/自建模型與Claude混合檢測教學.pdf`。

### 費用與調整

- 模型：Claude Opus 5.5。每次檢測約 US$0.04–0.07（7–8 張照片，每張壓縮到 640px），實際以 Console 的用量為準。
- 後端可接受 3–8 張照片；網站會一併送出每張照片拍的部位（`parts`），舊版只送 3 張的請求也相容。
- 調整合格門檻：修改 `wrangler.toml` 的 `PASS_SCORE` 後重新 `npx wrangler deploy`。
- 只有已驗證中央大學信箱的學生、從 `ALLOWED_ORIGINS` 網站送出的請求才會被處理，避免 API 額度被盜用。
- AI 結果由瀏覽器存進資料庫，懂技術的人有可能竄改，所以最後仍由技師核准。

## 檔案

| 檔案 | 內容 |
| --- | --- |
| `website/Eng.html` | 頁面結構 |
| `website/Style.css` | 樣式（淺色 / 深色主題變數、手機版） |
| `website/script.js` | 主程式（Firebase、路由、地圖、租借、後台） |
| `website/i18n.js` | 中英文字典 |
| `ai-inspector/src/index.ts` | AI 車況檢測服務（Cloudflare Worker，呼叫 Claude） |
| `ai-inspector/wrangler.toml` | 服務設定：合格門檻、允許的網站 |
| `docs/系統規格書_v2.0.pdf` | 系統規格書：架構、功能、AI 檢測、API、資料、安全、部署、設定與測試規格 |
| `docs/自建模型與Claude混合檢測教學.pdf` | 教學：訓練自己的損耗模型並與 Claude 合併判斷 |
| `ml-training/label_with_claude.py` | 用 Claude 預標註訓練照片（教學第 5 章） |
| `ml-training/fetch_commons_photos.py` | 從 Wikimedia Commons 下載自由授權的腳踏車照片（來源記錄在 sources.csv） |
| `ml-training/evaluate.html` | 模型準確度評估：選 test 資料夾，自動算出混淆矩陣與驗收指標（教學第 9 章）。在 final-project 執行 `python -m http.server 5500` 後開啟 http://localhost:5500/ml-training/evaluate.html |

## Firestore 資料結構

```
users/{學號}             balance, totalCarbon, dailyCarbon, lastRideDate, rideCount, redeemedCodes[], activeRide
users/{學號}/rides/{id}  bikeId, startAt, endAt, seconds, carbon, fee
bikes/{車號}             lat, lng, status (active | rented | maintenance), rentedBy
repairs/{id}             bikeId, desc, reporter, createdAt, status (open | fixed)
bikePhotos/{車號}        photos { whole_side, whole_front, frame, wheels, brakes, chain, cockpit, extra: { src, author?, license?, url? } }, condition, source
applications/{id}        studentId, createdAt, status (pending | approved | rejected), reason, photos[], photoParts[], bikeId, ai (AI 檢測報告)
feedback/{id}            name, contact, message, user, createdAt
```

`bikes` 集合是空的時候，網站會自動建立 `NCU-001`、`NCU-002` 兩台預設車輛。

> ⚠️ 目前 Firestore 安全規則是全開放（任何人都能讀寫），正式上線前需要設定規則，並把技師帳號改成真正的 Firebase 帳號。
