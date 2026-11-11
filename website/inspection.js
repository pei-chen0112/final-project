// ==========================================
// 🔍 車況檢測共用模組
// 網站（script.js）與案件測試頁（case_test.html）共用同一份判定程式，
// 確保測試結果與網站實際判定一致。
// ==========================================

// 🤖 AI 車況檢測服務網址（部署 ai-inspector 後填入，例如 "https://ncu-bike-inspector.xxx.workers.dev"）
// 留空代表不使用 AI，申請會直接送給技師人工審核
export const AI_INSPECT_URL = "https://ncu-bike-inspector.ncu-bike-inspector.workers.dev";
// 🧠 自建模型（Teachable Machine 匯出的 model.json / metadata.json / weights.bin 放在這個資料夾）
// 資料夾裡沒有模型時會自動略過，只使用 Claude
export const LOCAL_MODEL_URL = "model/";
const TFJS_URL = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js";
const TM_IMAGE_URL = "https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8.5/dist/teachablemachine-image.min.js";
export const GRADES = ["A", "B", "C", "D", "X"];               // 模型的類別名稱必須是這 5 個
export const GRADE_SCORE = { A: 95, B: 80, C: 60, D: 30 };     // 各等級的代表分數
export const PASS_SCORE = 70;                                   // 必須和 ai-inspector/wrangler.toml 的 PASS_SCORE 一致

const MAX_TOTAL = 900000; // 7–8 張照片要一起存進同一筆資料（Firestore 上限 1MB）

// 壓縮成 JPEG data URL，存進 Firestore（單一文件上限 1MB）
export function compressImage(file, maxSide, quality) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(Object.assign(new Error("err_img"), { i18nKey: "err_img" })); };
        img.src = url;
    });
}

// 依序嘗試較小的尺寸，直到總大小低於上限
export async function compressForUpload(files) {
    let photos = [];
    for (const [side, q] of [[640, 0.7], [512, 0.62], [400, 0.55]]) {
        photos = await Promise.all(files.map(f => compressImage(f, side, q)));
        if (photos.join("").length <= MAX_TOTAL) return photos;
    }
    throw Object.assign(new Error("err_too_big"), { i18nKey: "err_too_big" });
}

export async function runAiInspection(photos, parts, token) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 120000);
    try {
        const res = await fetch(AI_INSPECT_URL.replace(/\/+$/, "") + "/assess", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ photos, parts }),
            signal: ctrl.signal
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
        return data;
    } finally {
        clearTimeout(timer);
    }
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        s.onerror = () => reject(new Error("無法載入 " + src));
        document.head.appendChild(s);
    });
}

// 第一次需要時才載入（TensorFlow.js 約 1MB，不拖慢其他頁面）；沒有模型檔時回傳 null
let localModelPromise = null;
export function loadLocalModel() {
    if (!localModelPromise) {
        localModelPromise = (async () => {
            if (!LOCAL_MODEL_URL) return null;
            const head = await fetch(LOCAL_MODEL_URL + "model.json", { method: "HEAD", cache: "no-cache" }).catch(() => null);
            if (!head || !head.ok) return null; // 還沒放入模型
            await loadScript(TFJS_URL);
            await loadScript(TM_IMAGE_URL);
            const model = await window.tmImage.load(LOCAL_MODEL_URL + "model.json", LOCAL_MODEL_URL + "metadata.json");
            const labels = model.getClassLabels();
            if (!["A", "B", "C", "D"].every(g => labels.includes(g))) {
                throw new Error(`模型類別必須是 A、B、C、D、X，目前是：${labels.join(", ")}`);
            }
            return model;
        })().catch(e => { localModelPromise = null; throw e; });
    }
    return localModelPromise;
}

function dataUrlToImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

// 回傳 null 代表沒有自建模型
export async function runLocalModel(photos) {
    const model = await loadLocalModel();
    if (!model) return null;
    const perPhoto = [];
    for (const p of photos) {
        const preds = await model.predict(await dataUrlToImage(p)); // [{ className, probability }, ...]
        perPhoto.push(Object.fromEntries(preds.map(x => [x.className, x.probability])));
    }
    // 3 張照片的機率取平均
    const probs = {};
    GRADES.forEach(g => { probs[g] = perPhoto.reduce((s, p) => s + (p[g] || 0), 0) / perPhoto.length; });
    const topClass = GRADES.reduce((a, b) => (probs[a] >= probs[b] ? a : b));
    // 只用 A~D 計算分數（扣掉 X 的機率後重新分配）
    const bikeProb = 1 - probs.X;
    const score = bikeProb > 0.001
        ? Math.round(["A", "B", "C", "D"].reduce((s, g) => s + probs[g] * GRADE_SCORE[g], 0) / bikeProb)
        : 0;
    return { probs, topClass, confidence: probs[topClass], notBike: topClass === "X", score, wearRate: 100 - score };
}

// 合併規則：由上往下檢查，符合第一條就停止。回傳 null 代表兩邊都沒有結果
export function combineResults(local, claude) {
    if (!local && !claude) return null;
    if (!local) return claude; // 沒有自建模型：與原本只用 Claude 的結果相同

    // 有自建模型時一律視為信心充足，直接採用自建模型的分數與判定；Claude 結果只供參考
    const score = local.score;
    const verdict = score >= PASS_SCORE ? "pass" : "fail";
    const reasonKey = "hy_local_forced";
    return {
        hybrid: true, verdict, score, wearRate: score === null ? null : 100 - score,
        passScore: PASS_SCORE, reasonKey, local, claude, assessedAt: Date.now()
    };
}
