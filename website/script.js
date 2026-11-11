// ==========================================
// 🔥 1. Firebase 初始化與引入 (使用 CDN 模組)
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
    onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    getFirestore, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, collection, query, where, orderBy, limit,
    onSnapshot, runTransaction, writeBatch, increment, arrayUnion
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { translations } from "./i18n.js";

// 你的專屬 Firebase 設定檔
const firebaseConfig = {
    apiKey: "AIzaSyCt6qx2QVbf2APa6pH3aazf5m07Ru6R11I",
    authDomain: "ncubike-ad257.firebaseapp.com",
    projectId: "ncubike-ad257",
    storageBucket: "ncubike-ad257.firebasestorage.app",
    messagingSenderId: "565716105592",
    appId: "1:565716105592:web:f16a2a4bc336d3e20e308d",
    measurementId: "G-DECFV8GH51"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/*
 * Firestore 資料結構
 *  users/{學號}            balance, totalCarbon, dailyCarbon, lastRideDate, rideCount, redeemedCodes[], activeRide
 *  users/{學號}/rides/{id} bikeId, startAt, endAt, seconds, carbon, fee
 *  bikes/{車號}            lat, lng, status (active | rented | maintenance), rentedBy
 *  repairs/{id}            bikeId, desc, reporter, createdAt, status (open | fixed)
 *  applications/{id}       studentId, createdAt, status (pending | approved | rejected), reason, photos[], bikeId
 *  feedback/{id}           name, contact, message, user, createdAt
 */

// ==========================================
// ⚙️ 2. 系統設定
// ==========================================
const EMAIL_DOMAIN = "@ncu.edu.tw";           // 以「學號@ncu.edu.tw」作為 Firebase 帳號
const ADMIN_ID = "admin", ADMIN_PWD = "admin123"; // 技師後台登入（展示用）
const RIDE_FEE = 5;                            // 單次騎乘費用
const APPROVE_BONUS = 50;                      // 回收車輛上架獎勵
const AVG_SPEED_KMH = 15;                      // 估算用平均時速
const CARBON_PER_KM = 250;                     // 每公里減碳 (克)
const CARBON_PER_SEC = CARBON_PER_KM * AVG_SPEED_KMH / 3600; // ≈ 1.04 克 / 秒
const TREE_GRAMS_PER_DAY = 60;                 // 一棵樹一天約吸收 60 克 CO₂ (約 22 公斤 / 年)
const CAMPUS = [24.96815, 121.19242];          // 中央大學
const CAMPUS_RADIUS_M = 1200;                  // 還車校園範圍
const PROMO_CODES = { "SDGS-2024": 50, "PROFESSOR-100": 100 };
// 🤖 AI 車況檢測服務網址（部署 ai-inspector 後填入，例如 "https://ncu-bike-inspector.xxx.workers.dev"）
// 留空代表不使用 AI，申請會直接送給技師人工審核
const AI_INSPECT_URL = "";
// 🧠 自建模型（Teachable Machine 匯出的 model.json / metadata.json / weights.bin 放在這個資料夾）
// 資料夾裡沒有模型時會自動略過，只使用 Claude
const LOCAL_MODEL_URL = "model/";
const TFJS_URL = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js";
const TM_IMAGE_URL = "https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8.5/dist/teachablemachine-image.min.js";
const GRADES = ["A", "B", "C", "D", "X"];               // 模型的類別名稱必須是這 5 個
const GRADE_SCORE = { A: 95, B: 80, C: 60, D: 30 };     // 各等級的代表分數
const PASS_SCORE = 70;                                   // 必須和 ai-inspector/wrangler.toml 的 PASS_SCORE 一致
const LOCAL_MIN_CONFIDENCE = 0.6;                        // 自建模型信心低於這個值就不採用
const CLAUDE_WEIGHT = 0.6;                               // 最終分數 = Claude × 60% + 自建模型 × 40%
const DEFAULT_BIKES = {
    "NCU-001": { lat: 24.96815, lng: 121.19242 },
    "NCU-002": { lat: 24.96750, lng: 121.19450 }
};

// ==========================================
// 🧠 3. 狀態
// ==========================================
const state = {
    lang: "zh",
    route: "home",
    user: null,          // 目前登入的學號
    isAdmin: false,
    userDoc: null,       // users/{學號} 即時資料
    myApps: [],
    rides: [],
    bikes: {},
    bikesLoaded: false,
    admin: { apps: [], repairs: [], feedback: [] }
};
const unsubs = { user: [], admin: [] };
let authReady = false;
let pendingRoute = null;   // 登入後要前往的頁面
let pendingLoginId = null; // 正在登入 / 註冊的學號（保留大小寫）
let selectedBike = null;   // 解鎖面板中的車號

// ==========================================
// 🛠️ 4. 小工具
// ==========================================
const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

class AppError extends Error {
    constructor(key) { super(key); this.key = key; }
}

function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function t(key, vars) {
    let s = translations[state.lang]?.[key] ?? translations.zh[key] ?? key;
    if (vars && typeof s === "string") s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m));
    return s;
}

const locale = () => (state.lang === "zh" ? "zh-TW" : "en-US");
const fmtNum = (n) => Math.round(n || 0).toLocaleString(locale());
const toMillis = (v) => (typeof v === "number" ? v : v?.toMillis?.() ?? 0);

function fmtDuration(sec) {
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    const mm = String(m).padStart(2, "0"), ss = String(s).padStart(2, "0");
    return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function fmtDateTime(v) {
    const ms = toMillis(v);
    if (!ms) return "-";
    return new Date(ms).toLocaleString(locale(), { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
}

function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function distanceM(a, b) {
    const R = 6371000, rad = Math.PI / 180;
    const dLat = (b[0] - a[0]) * rad, dLng = (b[1] - a[1]) * rad;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
}

function maskId(id) {
    id = String(id);
    if (id.length <= 4) return id[0] + "***";
    return id.slice(0, 3) + "***" + id.slice(-2);
}

function errMsg(e) {
    if (e instanceof AppError) return t(e.key);
    if (e?.code === "unavailable" || e?.code === "auth/network-request-failed") return t("err_network");
    console.error(e);
    return t("err_generic", { msg: e?.message || e });
}

function authErrMsg(e) {
    switch (e?.code) {
        case "auth/invalid-credential":
        case "auth/invalid-login-credentials":
        case "auth/wrong-password":
        case "auth/user-not-found":
        case "auth/invalid-email": return t("err_login");
        case "auth/email-already-in-use": return t("err_id_taken");
        case "auth/weak-password": return t("err_pwd_short");
        case "auth/too-many-requests": return t("err_too_many");
        case "auth/network-request-failed": return t("err_network");
        default: return errMsg(e);
    }
}

// 每分鐘更新一次的車機動態密碼：同一台車、同一分鐘，所有人算出的密碼都相同
function bikeCode(bikeId, slot = Math.floor(Date.now() / 60000)) {
    let h = 2166136261;
    for (const ch of `${bikeId}:${slot}`) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    return String(1000 + ((h >>> 0) % 9000));
}
function verifyBikeCode(bikeId, code) {
    const slot = Math.floor(Date.now() / 60000);
    return code === bikeCode(bikeId, slot) || code === bikeCode(bikeId, slot - 1); // 允許剛換密碼的前一組
}

const userRef = () => doc(db, "users", state.user);

// ==========================================
// 💬 5. 提示訊息與對話框（取代 alert / prompt / confirm）
// ==========================================
function toast(message, type = "info", ms = 3800) {
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = message;
    $("toastStack").appendChild(el);
    setTimeout(() => { el.classList.add("leaving"); setTimeout(() => el.remove(), 220); }, ms);
}

/**
 * 開啟對話框，回傳 Promise（關閉時 resolve 按鈕的值；按 ✕ / Esc / 背景則為 null）
 * actions: [{ label, cls, value, onClick(modalEl) }]
 *   onClick 回傳 false 代表不關閉；丟出錯誤會顯示提示並保持開啟；其餘回傳值會成為結果
 */
function openModal({ title, html, actions = [], wide = false }) {
    return new Promise(resolve => {
        const wrap = document.createElement("div");
        wrap.className = "modal-backdrop";
        wrap.innerHTML = `
            <div class="modal ${wide ? "modal-wide" : ""}" role="dialog" aria-modal="true">
                <div class="modal-head"><h3>${title}</h3><button type="button" class="icon-btn modal-x" aria-label="${esc(t("close"))}">✕</button></div>
                <div class="modal-body">${html}</div>
                <div class="modal-actions"></div>
            </div>`;
        let closed = false;
        const done = (value) => {
            if (closed) return;
            closed = true;
            document.removeEventListener("keydown", onKey);
            wrap.classList.add("closing");
            setTimeout(() => {
                wrap.remove();
                document.body.classList.toggle("modal-open", !!$("modalRoot").children.length);
            }, 160);
            resolve(value);
        };
        const onKey = (e) => { if (e.key === "Escape") done(null); };
        wrap.addEventListener("mousedown", (e) => { if (e.target === wrap) done(null); });
        wrap.querySelector(".modal-x").onclick = () => done(null);

        const bar = wrap.querySelector(".modal-actions");
        actions.forEach(a => {
            const b = document.createElement("button");
            b.type = "button";
            b.className = `btn ${a.cls || "btn-primary"}`;
            b.textContent = a.label;
            b.onclick = async () => {
                if (!a.onClick) return done(a.value ?? null);
                b.classList.add("is-busy");
                let r;
                try { r = await a.onClick(wrap); }
                catch (err) { toast(errMsg(err), "error"); r = false; }
                finally { b.classList.remove("is-busy"); }
                if (r === false) return;
                done(r === undefined ? (a.value ?? true) : r);
            };
            bar.appendChild(b);
        });
        if (!actions.length) bar.remove();

        // 在輸入框按 Enter = 按下最後一個（主要）按鈕
        wrap.querySelectorAll("input").forEach(inp => inp.addEventListener("keydown", (e) => {
            if (e.key === "Enter") { e.preventDefault(); bar.lastElementChild?.click(); }
        }));

        $("modalRoot").appendChild(wrap);
        document.body.classList.add("modal-open");
        document.addEventListener("keydown", onKey);
        setTimeout(() => (wrap.querySelector("input, textarea, select") || wrap.querySelector(".modal-actions .btn:last-child") || wrap.querySelector(".modal-x")).focus(), 40);
    });
}

async function withBusy(btn, fn) {
    if (btn) { btn.classList.add("is-busy"); btn.disabled = true; }
    try { return await fn(); }
    finally { if (btn) { btn.classList.remove("is-busy"); btn.disabled = false; } }
}

function showFormError(el, msg) {
    el.textContent = msg;
    el.hidden = false;
}

// ==========================================
// 🌐 6. 雙語切換
// ==========================================
function applyI18n(root = document) {
    root.querySelectorAll("[data-i18n]").forEach(el => {
        const v = t(el.getAttribute("data-i18n"));
        if (typeof v === "string") el.innerHTML = v;
    });
    root.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.getAttribute("data-i18n-ph")); });
    root.querySelectorAll("[data-i18n-title]").forEach(el => {
        el.title = t(el.getAttribute("data-i18n-title"));
        el.setAttribute("aria-label", el.title);
    });
}

function changeLang(lang) {
    state.lang = translations[lang] ? lang : "zh";
    try { localStorage.setItem("NCU_Bikes_Lang", state.lang); } catch (e) { /* 無痕模式 */ }
    document.documentElement.lang = state.lang === "zh" ? "zh-Hant" : "en";
    $("langSelect").value = state.lang;
    applyI18n();
    renderUserMenu();
    if (authReady) refreshView();
}

// ==========================================
// 🌗 7. 深淺色模式
// ==========================================
function setTheme(mode, save) {
    document.documentElement.setAttribute("data-theme", mode);
    $("themeToggle").textContent = mode === "dark" ? "☀️" : "🌙";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", mode === "dark" ? "#171f19" : "#2e7d32");
    if (save) { try { localStorage.setItem("NCU_Bikes_Theme", mode); } catch (e) { /* 無痕模式 */ } }
}
function toggleTheme() {
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
}

// ==========================================
// 🧭 8. 頁面路由（使用網址 #hash，瀏覽器上一頁也能用）
// ==========================================
const ROUTES = {
    home: "mainMenuSection", login: "loginSection", register: "registerSection", map: "mapSection",
    member: "memberSection", upload: "uploadBikeSection", repair: "repairSection", carbon: "carbonSection", admin: "adminSection"
};
const VIEW_TO_ROUTE = Object.fromEntries(Object.entries(ROUTES).map(([r, v]) => [v, r]));
const PROTECTED = new Set(["member", "upload", "repair", "carbon"]);

function currentRoute() {
    const r = location.hash.replace("#", "");
    return ROUTES[r] ? r : "home";
}

function go(route) {
    if (location.hash === "#" + route) showRoute(route);
    else location.hash = route;
}

function showRoute(route) {
    if (!authReady) return;
    if (route === "admin" && !state.isAdmin) { toast(t("need_login"), "warn"); return go("login"); }
    if (PROTECTED.has(route) && !state.user) {
        if (state.isAdmin) return go("admin");
        pendingRoute = route;
        toast(t("need_login"), "warn");
        return go("login");
    }
    if ((route === "login" || route === "register") && (state.user || state.isAdmin)) return go(state.isAdmin ? "admin" : "home");

    state.route = route;
    const sectionId = ROUTES[route];
    document.querySelectorAll(".view-section").forEach(s => s.classList.toggle("active-view", s.id === sectionId));
    document.body.dataset.view = sectionId;
    document.querySelectorAll(".dock-item").forEach(a => a.classList.toggle("active", a.dataset.route === route));
    closeDropdown();
    if (route !== "map") closeRentPanel();
    window.scrollTo(0, 0);
    refreshView();
}

// 重新繪製目前頁面（換頁、換語言、資料更新時使用）
function refreshView() {
    switch (state.route) {
        case "home": renderHomeStats(); break;
        case "map":
            initMap();
            setTimeout(() => map && map.invalidateSize(), 60);
            updateMapChips();
            if (selectedBike) { // 切換語言時重畫車輛面板的文字
                $("bikePanelStatus").textContent = t("status_active");
                renderBikePanel(selectedBike, bikePhotoCache[selectedBike]);
            }
            break;
        case "upload": updateUploadCount(); break;
        case "member": renderMemberCenter(); break;
        case "repair": renderRepairSelect(); break;
        case "carbon": renderCarbon(true); break;
        case "admin": renderAdminDashboard(); break;
    }
    updateRideUI();
}

// 舊版函式名稱相容
const switchView = (sectionId) => go(VIEW_TO_ROUTE[sectionId] || "home");
const enterMap = () => go("map");
const enterMemberPage = () => go("member");
const enterRepairPage = () => go("repair");
const enterCarbonPage = () => go("carbon");

function scrollToStory() {
    $("storySection").scrollIntoView({ behavior: "smooth", block: "start" });
}

// ==========================================
// 🔐 9. 登入 / 註冊 / 登出
// ==========================================
function idFromUser(fbUser) {
    const email = (fbUser.email || "").toLowerCase();
    if (pendingLoginId && email === (pendingLoginId + EMAIL_DOMAIN).toLowerCase()) return pendingLoginId;
    try {
        const map = JSON.parse(localStorage.getItem("NCU_uid_map") || "{}");
        if (map[fbUser.uid]) return map[fbUser.uid];
    } catch (e) { /* 無痕模式 */ }
    return email.split("@")[0];
}

function rememberId(uid, id) {
    try {
        const map = JSON.parse(localStorage.getItem("NCU_uid_map") || "{}");
        map[uid] = id;
        localStorage.setItem("NCU_uid_map", JSON.stringify(map));
    } catch (e) { /* 無痕模式 */ }
}

function setSessionUser(fbUser) {
    const id = fbUser ? idFromUser(fbUser) : null;
    if (id === state.user) return;
    stopSubs("user");
    state.user = id;
    state.userDoc = null;
    state.myApps = [];
    state.rides = [];
    if (id) startUserSubs(id);
    renderUserMenu();
    updateRideUI();
}

onAuthStateChanged(auth, (fbUser) => {
    setSessionUser(fbUser);
    if (!authReady) {
        authReady = true;
        showRoute(currentRoute());
    } else if (!state.user && PROTECTED.has(state.route)) {
        go("home");
    } else {
        refreshView();
    }
});

async function handleLogin(event) {
    event.preventDefault();
    const id = $("loginId").value.trim();
    const pwd = $("loginPwd").value;
    const errEl = $("loginError");
    errEl.hidden = true;
    if (!id || !pwd) return showFormError(errEl, t("err_empty"));

    // 技師後台登入（不經過 Firebase）
    if (id === ADMIN_ID && pwd === ADMIN_PWD) {
        if (auth.currentUser) await signOut(auth);
        setSessionUser(null);
        state.isAdmin = true;
        try { sessionStorage.setItem("NCU_admin", "1"); } catch (e) { /* 無痕模式 */ }
        startAdminSubs();
        renderUserMenu();
        $("loginPwd").value = "";
        toast(t("login_welcome", { id: t("admin_name") }), "success");
        pendingRoute = null;
        return go("admin");
    }

    const btn = event.submitter || event.target.querySelector("button[type=submit]");
    await withBusy(btn, async () => {
        try {
            pendingLoginId = id;
            const cred = await signInWithEmailAndPassword(auth, id + EMAIL_DOMAIN, pwd);
            rememberId(cred.user.uid, id);
            exitAdmin();
            setSessionUser(cred.user);
            $("loginId").value = "";
            $("loginPwd").value = "";
            toast(t("login_welcome", { id }), "success");
            const target = pendingRoute || "home";
            pendingRoute = null;
            go(target);
        } catch (e) {
            showFormError(errEl, authErrMsg(e));
        } finally {
            pendingLoginId = null;
        }
    });
}

async function handleRegister(event) {
    event.preventDefault();
    const id = $("regId").value.trim();
    const pwd = $("regPwd").value;
    const pwd2 = $("regPwd2").value;
    const errEl = $("regError");
    errEl.hidden = true;
    if (!/^[A-Za-z0-9_-]{3,20}$/.test(id)) return showFormError(errEl, t("err_id_format"));
    if (pwd.length < 6) return showFormError(errEl, t("err_pwd_short"));
    if (pwd !== pwd2) return showFormError(errEl, t("err_pwd_mismatch"));

    const btn = event.submitter || event.target.querySelector("button[type=submit]");
    await withBusy(btn, async () => {
        try {
            pendingLoginId = id;
            // 1. 建立 Firebase 帳號（建立後會自動登入）
            const cred = await createUserWithEmailAndPassword(auth, id + EMAIL_DOMAIN, pwd);
            rememberId(cred.user.uid, id);
            // 2. 在 Firestore 建立該學生的專屬資料文件：users(集合) -> 學號(文件)
            await setDoc(doc(db, "users", id), newUserData(id));
            exitAdmin();
            setSessionUser(cred.user);
            ["regId", "regPwd", "regPwd2"].forEach(k => { $(k).value = ""; });
            toast(t("alt_reg_ok"), "success");
            const target = pendingRoute || "home";
            pendingRoute = null;
            go(target);
        } catch (e) {
            showFormError(errEl, authErrMsg(e));
        } finally {
            pendingLoginId = null;
        }
    });
}

function newUserData(id) {
    return {
        studentId: id,
        balance: 0,          // 儲值金
        totalCarbon: 0,      // 累積總節碳量
        dailyCarbon: 0,      // 本日節碳量
        lastRideDate: "",    // 最後騎乘日期（用來判斷每日歸零）
        rideCount: 0,
        redeemedCodes: [],
        activeRide: null,
        createdAt: Date.now()
    };
}

function exitAdmin() {
    if (!state.isAdmin) return;
    state.isAdmin = false;
    try { sessionStorage.removeItem("NCU_admin"); } catch (e) { /* 無痕模式 */ }
    stopSubs("admin");
}

async function logoutCore() {
    exitAdmin();
    if (auth.currentUser) await signOut(auth);
    setSessionUser(null);
    renderUserMenu();
}

async function logout() {
    await logoutCore();
    toast(t("logged_out"));
    go("home");
}

async function switchAccount() {
    await logoutCore();
    go("login");
}

function showForgotPassword() {
    openModal({ title: t("forget_title"), html: `<p>${t("alt_forget")}</p>`, actions: [{ label: t("ok") }] });
}

// ---------- 右上角使用者選單 ----------
function renderUserMenu() {
    const box = $("userMenu");
    if (!state.user && !state.isAdmin) {
        box.innerHTML = `<button type="button" class="user-btn" onclick="go('login')">${t("btn_login_nav")}</button>`;
        return;
    }
    const name = state.isAdmin ? t("admin_name") : `👤 ${esc(state.user)}`;
    box.innerHTML = `
        <div class="dropdown" id="userDropdown">
            <button type="button" class="user-btn" onclick="toggleUserDropdown(event)">${name} ▾</button>
            <div class="dropdown-content">
                ${state.isAdmin
                    ? `<button type="button" onclick="go('admin')">${t("admin_title")}</button>`
                    : `<button type="button" onclick="go('member')">👤 ${t("menu_member")}</button>`}
                <button type="button" onclick="switchAccount()">🔁 ${t("btn_switch_nav")}</button>
                <button type="button" onclick="logout()">🚪 ${t("btn_logout_nav")}</button>
            </div>
        </div>`;
}

function toggleUserDropdown(event) {
    event.stopPropagation();
    $("userDropdown")?.classList.toggle("show-dropdown");
}
function closeDropdown() {
    $("userDropdown")?.classList.remove("show-dropdown");
}

// ==========================================
// ☁️ 10. 雲端資料即時同步
// ==========================================
function stopSubs(group) {
    unsubs[group].forEach(fn => fn());
    unsubs[group] = [];
}

function onSnapError(err) {
    console.error("Firestore 同步失敗：", err);
    toast(t("err_db"), "error");
}

function startUserSubs(id) {
    const uRef = doc(db, "users", id);
    unsubs.user.push(onSnapshot(uRef, (snap) => {
        if (state.user !== id) return;
        if (!snap.exists()) {
            // 舊帳號沒有資料文件時自動補建
            setDoc(uRef, newUserData(id), { merge: true }).catch(onSnapError);
            return;
        }
        state.userDoc = snap.data();
        if (state.route === "member") renderMemberCenter();
        if (state.route === "carbon") renderCarbon(false);
        updateRideUI();
    }, onSnapError));

    unsubs.user.push(onSnapshot(query(collection(db, "applications"), where("studentId", "==", id)), (snap) => {
        state.myApps = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
        if (state.route === "member") renderMemberCenter();
    }, onSnapError));

    unsubs.user.push(onSnapshot(query(collection(db, "users", id, "rides"), orderBy("startAt", "desc"), limit(30)), (snap) => {
        state.rides = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (state.route === "member") renderMemberCenter();
    }, onSnapError));
}

function startAdminSubs() {
    stopSubs("admin");
    const rerender = () => { if (state.route === "admin") renderAdminDashboard(); };
    const sortDesc = (arr) => arr.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
    unsubs.admin.push(onSnapshot(collection(db, "applications"), (snap) => {
        state.admin.apps = sortDesc(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        rerender();
    }, onSnapError));
    unsubs.admin.push(onSnapshot(collection(db, "repairs"), (snap) => {
        state.admin.repairs = sortDesc(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        rerender();
    }, onSnapError));
    unsubs.admin.push(onSnapshot(query(collection(db, "feedback"), orderBy("createdAt", "desc"), limit(50)), (snap) => {
        state.admin.feedback = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        rerender();
    }, onSnapError));
}

// 車輛資料所有人共用（未登入也能看地圖）
let bikesSeeded = false;
function startBikeSub() {
    onSnapshot(collection(db, "bikes"), (snap) => {
        if (snap.empty && !snap.metadata.fromCache && !bikesSeeded) {
            bikesSeeded = true;
            seedBikes();
            return;
        }
        state.bikes = {};
        snap.forEach(d => { state.bikes[d.id] = d.data(); });
        state.bikesLoaded = true;

        renderMarkers();
        updateMapChips();
        renderHomeStats();
        if (state.route === "repair") renderRepairSelect();
        if (state.route === "admin") renderAdminDashboard();
        if (selectedBike && state.bikes[selectedBike]?.status !== "active") {
            closeRentPanel();
            toast(t("err_bike_unavailable"), "warn");
        }
    }, onSnapError);
}

async function seedBikes() {
    const batch = writeBatch(db);
    Object.entries(DEFAULT_BIKES).forEach(([id, pos]) => {
        batch.set(doc(db, "bikes", id), { ...pos, status: "active", rentedBy: null, createdAt: Date.now() });
    });
    await batch.commit().catch(onSnapError);
}

// ==========================================
// 🏠 11. 首頁 & 資訊頁
// ==========================================
function renderHomeStats() {
    const available = Object.values(state.bikes).filter(b => b.status === "active").length;
    $("heroAvailable").textContent = state.bikesLoaded ? available : "–";
}

function openInfo(key) {
    const closeBtn = { label: t("close"), cls: "btn-ghost" };
    switch (key) {
        case "donate":
            return openModal({
                title: t("nav_donate"), html: t("info_donate_body"), wide: true,
                actions: [closeBtn, { label: t("info_go_apply"), onClick: () => { go("upload"); } }]
            });
        case "guide":
            return openModal({
                title: t("nav_guide"), html: t("info_guide_body"), wide: true,
                actions: [closeBtn, { label: t("info_go_map"), onClick: () => { go("map"); } }]
            });
        case "faq":
            return openModal({
                title: t("nav_faq"), wide: true,
                html: t("faq").map(([q, a]) => `<details class="faq-item"><summary>${q}</summary><p>${a}</p></details>`).join(""),
                actions: [closeBtn]
            });
        case "terms":
            return openModal({ title: t("footer_terms"), html: t("info_terms_body"), wide: true, actions: [closeBtn] });
        case "privacy":
            return openModal({ title: t("footer_privacy"), html: t("info_privacy_body"), wide: true, actions: [closeBtn] });
        case "contact":
            return openModal({
                title: t("nav_contact"), wide: true,
                html: `${t("info_contact_body")}
                    <div class="input-group"><label for="fbName">${t("fb_name")}</label><input id="fbName" maxlength="40" value="${esc(state.user || "")}"></div>
                    <div class="input-group"><label for="fbContact">${t("fb_contact")}</label><input id="fbContact" maxlength="80"></div>
                    <div class="input-group"><label for="fbMsg">${t("fb_msg")}</label><textarea id="fbMsg" rows="4" maxlength="500"></textarea></div>`,
                actions: [closeBtn, {
                    label: t("fb_send"),
                    onClick: async (m) => {
                        const message = m.querySelector("#fbMsg").value.trim();
                        if (!message) throw new AppError("err_empty");
                        await addDoc(collection(db, "feedback"), {
                            name: m.querySelector("#fbName").value.trim(),
                            contact: m.querySelector("#fbContact").value.trim(),
                            message,
                            user: state.user || null,
                            createdAt: Date.now()
                        });
                        toast(t("fb_ok"), "success");
                    }
                }]
            });
    }
}

// ==========================================
// 🗺️ 12. 地圖
// ==========================================
let map = null, meMarker = null;
const bikeMarkers = {};

function initMap() {
    if (map) return;
    map = L.map("map", { zoomControl: false }).setView(CAMPUS, 16);
    L.control.zoom({ position: "topright" }).addTo(map);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    renderMarkers();
}

function bikeIcon() {
    return L.divIcon({
        className: "bike-pin",
        html: '<div class="pin"><span>🚲</span></div>',
        iconSize: [42, 42],
        iconAnchor: [21, 50],
        tooltipAnchor: [0, -48]
    });
}

function renderMarkers() {
    if (!map) return;
    const visible = Object.keys(state.bikes).filter(id => state.bikes[id].status === "active");
    Object.keys(bikeMarkers).forEach(id => {
        if (!visible.includes(id)) { map.removeLayer(bikeMarkers[id]); delete bikeMarkers[id]; }
    });
    visible.forEach(id => {
        const pos = [state.bikes[id].lat, state.bikes[id].lng];
        let m = bikeMarkers[id];
        if (!m) {
            m = L.marker(pos, { icon: bikeIcon(), riseOnHover: true }).addTo(map);
            m.bindTooltip(id, { direction: "top" });
            m.on("click", () => openRentPanel(id));
            bikeMarkers[id] = m;
        } else {
            m.setLatLng(pos);
        }
    });
}

function updateMapChips() {
    const n = Object.values(state.bikes).filter(b => b.status === "active").length;
    $("mapAvailable").textContent = state.bikesLoaded ? t("map_available", { n }) : t("loading");
}

function getPosition(timeout = 8000) {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error("no geolocation"));
        navigator.geolocation.getCurrentPosition(
            p => resolve([p.coords.latitude, p.coords.longitude]),
            reject,
            { enableHighAccuracy: true, timeout, maximumAge: 30000 }
        );
    });
}

async function locateMe() {
    if (!map) return;
    try {
        const ll = await getPosition();
        if (!meMarker) {
            meMarker = L.marker(ll, {
                icon: L.divIcon({ className: "", html: '<div class="me-dot"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }),
                zIndexOffset: 1000, interactive: false
            }).addTo(map);
        } else {
            meMarker.setLatLng(ll);
        }
        map.setView(ll, 17);
    } catch (e) {
        toast(t("err_geo"), "error");
    }
}

// ==========================================
// 🔓 13. 租借與還車
// ==========================================
// ---------- 腳踏車線稿藍圖 ----------
// 可以點選的部位（對應回收申請的拍攝部位）；座墊與把手都屬於 cockpit
const BLUEPRINT_PARTS = ["frame", "wheels", "brakes", "chain", "cockpit"];
const BP_SHAPES = {
    wheels: () => [95, 305].map(cx => {
        const spokes = Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6;
            return `<line x1="${cx}" y1="165" x2="${(cx + 50 * Math.cos(a)).toFixed(1)}" y2="${(165 + 50 * Math.sin(a)).toFixed(1)}" class="bp-thin"/>`;
        }).join("");
        return `<circle cx="${cx}" cy="165" r="60"/><circle cx="${cx}" cy="165" r="52"/><circle cx="${cx}" cy="165" r="5"/>${spokes}`;
    }).join(""),
    frame: () => `<path d="M95 165 L185 168 L168 90 Z M168 90 L274 84 L282 112 L185 168 M274 84 L282 112 M282 112 Q294 140 305 165"/>`,
    brakes: () => `<path d="M126 113 Q136 106 146 116"/><path d="M128 121 L144 121" class="bp-thin"/>
        <path d="M274 104 Q284 96 296 103"/><path d="M276 111 L294 111" class="bp-thin"/>
        <path d="M300 66 Q306 88 290 102" class="bp-dash"/><path d="M290 64 Q220 70 146 112" class="bp-dash"/>`,
    chain: () => `<circle cx="185" cy="168" r="18"/><circle cx="185" cy="168" r="10" class="bp-thin"/><circle cx="95" cy="165" r="9"/>
        <path d="M185 150 L95 156 M185 186 L95 174"/><path d="M185 168 L202 196"/><rect x="190" y="194" width="26" height="6" rx="2"/>`,
    cockpit: () => `<path d="M168 90 L164 66"/><path d="M142 62 Q162 55 188 60 L184 67 Q162 66 146 67 Z"/>
        <path d="M274 84 L279 64"/><path d="M262 62 Q280 54 299 60 Q309 65 304 76"/><path d="M296 60 L304 58" class="bp-thick"/>`
};

function bikeBlueprintSvg(highlight = null, { interactive = false, available = null } = {}) {
    const groups = BLUEPRINT_PARTS.map(part => {
        const shapes = BP_SHAPES[part]();
        const cls = ["bp-part", highlight === part || highlight === "whole" ? "is-active" : "", available && !available.has(part) ? "is-empty" : ""].join(" ");
        const a11y = interactive ? ` tabindex="0" role="button" aria-label="${esc(t("part_" + part))}"` : "";
        // bp-hit：透明的粗線，讓手機也點得到細線條
        return `<g class="${cls}" data-part="${part}"${a11y}><g class="bp-hit">${shapes}</g><g class="bp-line">${shapes}</g></g>`;
    }).join("");
    return `<svg class="blueprint${interactive ? " interactive" : ""}" viewBox="20 40 360 200" role="img" aria-label="${esc(t("part_whole"))}">
        <defs><pattern id="bpGrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0 L0 0 0 20" class="bp-grid"/></pattern></defs>
        <rect x="20" y="40" width="360" height="200" fill="url(#bpGrid)"/>${groups}</svg>`;
}

// ---------- 車輛資訊面板 ----------
const bikePhotoCache = {};  // bikePhotos/{車號} 的快取（照片只在點車時才下載）
let panelPart = null;

async function loadBikePhotos(id) {
    if (!(id in bikePhotoCache)) {
        try {
            const snap = await getDoc(doc(db, "bikePhotos", id));
            bikePhotoCache[id] = snap.exists() ? snap.data() : null;
        } catch (e) {
            console.warn("讀取車輛照片失敗：", e);
            return null;
        }
    }
    return bikePhotoCache[id];
}

function bikePhotoFor(data, part) {
    const photos = data?.photos || {};
    const p = part === "whole" ? (photos.whole_side || photos.whole_front) : photos[part];
    return p && String(p.src || "").startsWith("data:image/") ? p : null;
}

function openRentPanel(id) {
    if (state.bikes[id]?.status !== "active") return toast(t("err_bike_unavailable"), "error");
    selectedBike = id;
    $("inputPlateNum").value = id;
    $("inputEPassword").value = "";
    $("bikePanelTitle").textContent = id;
    $("bikePanelStatus").className = "badge badge-active";
    $("bikePanelStatus").textContent = t("status_active");
    // 沒登入可以看車況，登入後才能解鎖；騎乘中不能再借
    $("unlockLogin").hidden = !!state.user;
    $("unlockSection").hidden = !state.user || !!state.userDoc?.activeRide;
    $("rentVerifyPanel").hidden = false;
    $("rentVerifyPanel").scrollTop = 0;
    document.body.classList.add("bike-panel-open");
    renderBikePanel(id, bikePhotoCache[id]);
    tickBikeScreen();
    if (!(id in bikePhotoCache)) {
        $("bikePhotoFrame").innerHTML = `<span class="muted small">${t("bike_loading_photos")}</span>`;
        loadBikePhotos(id).then(data => { if (selectedBike === id) renderBikePanel(id, data); });
    }
}

function renderBikePanel(id, data) {
    const available = new Set(BLUEPRINT_PARTS.filter(p => bikePhotoFor(data, p)));
    $("bikeBlueprint").innerHTML = bikeBlueprintSvg(null, { interactive: true, available });
    const chips = ["whole", ...BLUEPRINT_PARTS, ...(bikePhotoFor(data, "extra") ? ["extra"] : [])];
    $("bikePartChips").innerHTML = chips.map(p =>
        `<button type="button" class="part-chip${bikePhotoFor(data, p) ? "" : " is-empty"}" data-part="${p}">${t("part_" + p)}</button>`).join("");
    const cond = data?.condition;
    $("bikeCondition").hidden = !cond;
    if (cond) $("bikeCondition").textContent = t("bike_condition", { score: clampScore(cond.score), wear: clampScore(cond.wearRate) });
    showBikePart(panelPart && bikePhotoFor(data, panelPart) ? panelPart : "whole", data);
}

function showBikePart(part, data = bikePhotoCache[selectedBike]) {
    panelPart = part;
    const svg = $("bikeBlueprint").querySelector("svg");
    svg?.classList.toggle("show-whole", part === "whole");
    $("bikeBlueprint").querySelectorAll(".bp-part").forEach(g => g.classList.toggle("is-active", g.dataset.part === part));
    $("bikePartChips").querySelectorAll(".part-chip").forEach(c => c.classList.toggle("active", c.dataset.part === part));
    const photo = bikePhotoFor(data, part);
    if (!photo) {
        $("bikePhotoFrame").innerHTML = `<span class="muted small">${t(data ? "bike_no_part_photo" : "bike_no_photos")}</span>`;
        $("bikePhotoCaption").textContent = t("part_" + part);
        return;
    }
    $("bikePhotoFrame").innerHTML = `<img src="${esc(photo.src)}" alt="${esc(t("part_" + part))}">`;
    const url = String(photo.url || "");
    const credit = photo.author || photo.license
        ? ` <span class="credit">${t("bike_photo_credit")}：${url.startsWith("https://commons.wikimedia.org/")
            ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(photo.author || "Wikimedia Commons")}</a>`
            : esc(photo.author || "")}${photo.license ? " · " + esc(photo.license) : ""}</span>`
        : "";
    $("bikePhotoCaption").innerHTML = `<strong>${t("part_" + part)}</strong>${credit}`;
}

function loginToRent() {
    pendingRoute = "map";
    closeRentPanel();
    go("login");
}

function closeRentPanel() {
    $("rentVerifyPanel").hidden = true;
    document.body.classList.remove("bike-panel-open");
    selectedBike = null;
    panelPart = null;
}

function tickBikeScreen() {
    if (!selectedBike) return;
    $("bikeScreenCode").textContent = bikeCode(selectedBike);
    $("bikeScreenTimer").textContent = t("screen_refresh", { s: 60 - (Math.floor(Date.now() / 1000) % 60) });
}

async function confirmRent() {
    const bikeId = selectedBike;
    const pin = $("inputEPassword").value.trim();
    if (!bikeId) return;
    if (!/^\d{4}$/.test(pin)) return toast(t("err_pin_format"), "warn");
    // 1. 驗證實體車機的電子密碼
    if (!verifyBikeCode(bikeId, pin)) return toast(t("err_pwd"), "error");

    await withBusy($("rentBtn"), async () => {
        try {
            // 2. 以交易同時確認餘額、車輛狀態，並扣款 + 鎖定車輛（避免兩人同時借到同一台）
            const newBalance = await runTransaction(db, async (tx) => {
                const uRef = userRef(), bRef = doc(db, "bikes", bikeId);
                const uSnap = await tx.get(uRef);
                const bSnap = await tx.get(bRef);
                const u = uSnap.data() || {};
                const b = bSnap.data();
                if (!b || b.status !== "active") throw new AppError("err_bike_unavailable");
                if (u.activeRide) throw new AppError("err_renting");
                const balance = u.balance || 0;
                if (balance < RIDE_FEE) throw new AppError("err_bal");
                tx.set(uRef, { balance: balance - RIDE_FEE, activeRide: { bikeId, startAt: Date.now(), startLat: b.lat, startLng: b.lng } }, { merge: true });
                tx.update(bRef, { status: "rented", rentedBy: state.user, updatedAt: Date.now() });
                return balance - RIDE_FEE;
            });
            closeRentPanel();
            toast(t("alt_rent_ok", { bal: newBalance }), "success", 5000);
        } catch (e) {
            toast(errMsg(e), "error");
        }
    });
}

// 還車位置：在校園內用 GPS；不在校園或無法定位時，用地圖目前顯示的位置
async function getReturnPosition(ride) {
    let gps = null;
    try { gps = await getPosition(); } catch (e) { /* 使用者拒絕或無法定位 */ }
    if (gps && distanceM(gps, CAMPUS) <= CAMPUS_RADIUS_M) return { pos: gps, outside: false };
    const center = map ? map.getCenter() : null;
    const centerPos = center ? [center.lat, center.lng] : null;
    const fallback = centerPos && distanceM(centerPos, CAMPUS) <= CAMPUS_RADIUS_M
        ? centerPos
        : [ride.startLat ?? CAMPUS[0], ride.startLng ?? CAMPUS[1]];
    return { pos: fallback, outside: !!gps };
}

async function returnBike() {
    const ride = state.userDoc?.activeRide;
    if (!ride) return;
    await withBusy($("returnBtn"), async () => {
        const { pos, outside } = await getReturnPosition(ride);
        try {
            const summary = await runTransaction(db, async (tx) => {
                const uRef = userRef(), bRef = doc(db, "bikes", ride.bikeId);
                const uSnap = await tx.get(uRef);
                const bSnap = await tx.get(bRef);
                const u = uSnap.data() || {};
                const r = u.activeRide;
                if (!r) return null;
                const endAt = Date.now();
                const seconds = Math.max(1, Math.round((endAt - r.startAt) / 1000));
                const carbon = Math.round(seconds * CARBON_PER_SEC);
                const today = todayStr();
                const daily = (u.lastRideDate === today ? (u.dailyCarbon || 0) : 0) + carbon;

                tx.set(uRef, {
                    activeRide: null,
                    totalCarbon: (u.totalCarbon || 0) + carbon,
                    dailyCarbon: daily,
                    lastRideDate: today,
                    rideCount: (u.rideCount || 0) + 1
                }, { merge: true });
                if (bSnap.exists()) {
                    const b = bSnap.data();
                    tx.update(bRef, { lat: pos[0], lng: pos[1], status: b.status === "rented" ? "active" : b.status, rentedBy: null, updatedAt: endAt });
                }
                tx.set(doc(collection(db, "users", state.user, "rides")), {
                    bikeId: r.bikeId, startAt: r.startAt, endAt, seconds, carbon, fee: RIDE_FEE
                });
                return { seconds, carbon };
            });
            if (!summary) return;
            if (map) map.setView(pos, 17);
            const km = (summary.seconds / 3600 * AVG_SPEED_KMH).toFixed(2);
            openModal({
                title: t("ret_title"),
                html: `<div class="summary-grid">
                        <div><strong>${fmtDuration(summary.seconds)}</strong><span>${t("ret_duration")}</span></div>
                        <div><strong>${km} km</strong><span>${t("ret_distance")}</span></div>
                        <div><strong>${fmtNum(summary.carbon)} g</strong><span>${t("ret_carbon")}</span></div>
                        <div><strong>$${RIDE_FEE}</strong><span>${t("ret_fee")}</span></div>
                    </div>
                    ${outside ? `<p class="hint-danger" style="margin-top:14px">${t("ret_outside")}</p>` : ""}`,
                actions: [{ label: t("ok") }]
            });
        } catch (e) {
            toast(errMsg(e), "error");
        }
    });
}

function updateRideUI() {
    const ride = state.user ? state.userDoc?.activeRide : null;
    const onMap = state.route === "map";
    $("activeRidePanel").hidden = !(ride && onMap);
    $("ridePill").hidden = !ride || onMap;
    if (ride) {
        $("rentedBikeId").textContent = ride.bikeId;
        tickRide();
    }
}

function tickRide() {
    const ride = state.userDoc?.activeRide;
    if (!ride || !state.user) return;
    const sec = (Date.now() - ride.startAt) / 1000;
    const time = fmtDuration(sec);
    $("rideTimer").textContent = time;
    $("rideCarbon").textContent = "🌱 " + t("ride_carbon_live", { g: fmtNum(sec * CARBON_PER_SEC) });
    $("ridePill").textContent = "🚲 " + t("ride_pill", { id: ride.bikeId, time });
}

// ==========================================
// 🔧 14. 車輛報修
// ==========================================
function renderRepairSelect() {
    const sel = $("repairBikeId");
    const prev = sel.value;
    const ids = Object.keys(state.bikes).sort();
    sel.innerHTML = `<option value="">${t("rep_select_ph")}</option>` +
        ids.map(id => `<option value="${esc(id)}">${esc(id)} · ${t("status_" + state.bikes[id].status)}</option>`).join("");
    if (ids.includes(prev)) sel.value = prev;
}

// 報修照片：損壞部位照片 1–3 張（供維修及 AI 判讀使用）
const REPAIR_PHOTO_MAX = 3;
const REPAIR_PHOTO_MAX_BYTES = 5 * 1024 * 1024;
const REPAIR_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

function previewRepairPhotos(input) {
    const box = $("repairThumbs");
    box.querySelectorAll("img").forEach(img => URL.revokeObjectURL(img.src));
    box.replaceChildren(...[...input.files].map(file => {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        return img;
    }));
}

async function submitRepair() {
    const bikeId = $("repairBikeId").value;
    const desc = $("repairDesc").value.trim();
    const photoInput = $("repairPhotos");
    const files = [...photoInput.files];
    if (!bikeId || !desc) return toast(t("err_empty"), "warn");
    if (files.length === 0) return toast(t("err_rep_photo_none"), "warn");
    if (files.length > REPAIR_PHOTO_MAX) return toast(t("err_rep_photo_many"), "warn");
    if (files.some(f => !REPAIR_PHOTO_TYPES.includes(f.type))) return toast(t("err_rep_photo_type"), "warn");
    if (files.some(f => f.size > REPAIR_PHOTO_MAX_BYTES)) return toast(t("err_rep_photo_size"), "warn");

    await withBusy($("repairBtn"), async () => {
        try {
            // 壓縮後存進雲端（和報修單同一筆資料），技師在任何裝置都看得到
            let photos = await Promise.all(files.map(f => compressImage(f, 800, 0.72)));
            if (photos.join("").length > 700000) photos = await Promise.all(files.map(f => compressImage(f, 560, 0.6)));
            await runTransaction(db, async (tx) => {
                const bRef = doc(db, "bikes", bikeId);
                const b = (await tx.get(bRef)).data();
                if (!b) throw new AppError("err_bike_unavailable");
                if (b.status === "rented") throw new AppError(b.rentedBy === state.user ? "err_return_first" : "err_bike_in_use");
                if (b.status === "maintenance") throw new AppError("err_already_maint");
                tx.set(doc(collection(db, "repairs")), { bikeId, desc, photos, reporter: state.user, createdAt: Date.now(), status: "open" });
                tx.update(bRef, { status: "maintenance", updatedAt: Date.now() });
            });
            $("repairBikeId").value = "";
            $("repairDesc").value = "";
            photoInput.value = "";
            previewRepairPhotos(photoInput);
            toast(t("alt_rep_ok"), "success");
            go("home");
        } catch (e) {
            toast(errMsg(e), e instanceof AppError ? "warn" : "error");
        }
    });
}

// ==========================================
// 📸 15. 回收申請：照片壓縮上傳
// ==========================================
// 回收申請要拍的照片：整體 2 張 + 5 個指定部位（必拍）+ 其他損壞處（選填）
const PHOTO_PARTS = [
    { key: "whole_side", part: "whole", required: true },
    { key: "whole_front", part: "whole", required: true },
    { key: "frame", part: "frame", required: true },
    { key: "wheels", part: "wheels", required: true },
    { key: "brakes", part: "brakes", required: true },
    { key: "chain", part: "chain", required: true },
    { key: "cockpit", part: "cockpit", required: true },
    { key: "extra", part: null, required: false }
];
const OLD_PHOTO_KEYS = ["whole_front", "whole_side", "extra"]; // 舊版 3 張照片的順序：正面、側面、特寫

// 產生拍攝格（只產生一次；文字用 data-i18n，切換語言時會自動更新，已選的照片不會消失）
function renderPhotoSlots() {
    $("photoSlots").innerHTML = PHOTO_PARTS.map(p => `
        <label class="part-slot${p.required ? "" : " optional"}">
            <input type="file" accept="image/*" data-part="${p.key}" onchange="previewPhoto(this)">
            <span class="photo-preview">${p.part ? bikeBlueprintSvg(p.part) : '<span class="extra-icon">＋</span>'}</span>
            <span class="part-slot-text">
                <strong><span data-i18n="part_${p.key}"></span>
                    <em class="part-tag ${p.required ? "req" : "opt"}" data-i18n="${p.required ? "tag_required" : "tag_optional"}"></em></strong>
                <small data-i18n="hint_${p.key}"></small>
            </span>
        </label>`).join("");
}

function updateUploadCount() {
    const required = PHOTO_PARTS.filter(p => p.required);
    const done = required.filter(p => document.querySelector(`#photoSlots input[data-part="${p.key}"]`)?.files[0]).length;
    $("uploadCount").textContent = t("upload_count", { n: done, total: required.length });
    $("uploadCount").classList.toggle("complete", done === required.length);
}

function previewPhoto(input) {
    if (input.closest("#photoSlots")) setTimeout(updateUploadCount);
    const preview = input.parentElement.querySelector(".photo-preview");
    const file = input.files[0];
    if (preview.dataset.url) URL.revokeObjectURL(preview.dataset.url);
    if (!file) {
        preview.style.backgroundImage = "";
        preview.classList.remove("has-image");
        return;
    }
    const url = URL.createObjectURL(file);
    preview.dataset.url = url;
    preview.style.backgroundImage = `url("${url}")`;
    preview.classList.add("has-image");
}

// 壓縮成 JPEG data URL，存進 Firestore（單一文件上限 1MB）
function compressImage(file, maxSide, quality) {
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
        img.onerror = () => { URL.revokeObjectURL(url); reject(new AppError("err_img")); };
        img.src = url;
    });
}

async function confirmBikeUpload() {
    const inputs = [...document.querySelectorAll("#photoSlots input[type=file]")];
    const chosen = inputs.filter(inp => inp.files[0]).map(inp => ({ key: inp.dataset.part, file: inp.files[0] }));
    const missing = PHOTO_PARTS.filter(p => p.required && !chosen.some(c => c.key === p.key));
    if (missing.length) return toast(t("err_upload_parts", { parts: missing.map(p => t("part_" + p.key)).join("、") }), "warn", 5000);
    const files = chosen.map(c => c.file);
    const parts = chosen.map(c => c.key);

    // 1. 壓縮照片，並請 AI 檢測車況
    let photos = null, ai = null;
    await withBusy($("uploadBtn"), async () => {
        try {
            // 7–8 張照片要一起存進同一筆資料（Firestore 上限 1MB），太大就再壓小一點
            const MAX_TOTAL = 900000;
            for (const [side, q] of [[640, 0.7], [512, 0.62], [400, 0.55]]) {
                photos = await Promise.all(files.map(f => compressImage(f, side, q)));
                if (photos.join("").length <= MAX_TOTAL) break;
            }
            if (photos.join("").length > MAX_TOTAL) throw new AppError("err_too_big");
        } catch (e) {
            photos = null;
            return toast(errMsg(e), "error");
        }
        // 自建模型與 Claude 同時執行，總時間只取決於比較慢的那個
        const useClaude = !!AI_INSPECT_URL;
        if (useClaude) toast(t("ai_checking"), "info", 6000);
        const [localRes, claudeRes] = await Promise.allSettled([
            runLocalModel(photos),
            useClaude ? runAiInspection(photos, parts) : Promise.resolve(null)
        ]);
        const local = localRes.status === "fulfilled" ? localRes.value : null;
        const claude = claudeRes.status === "fulfilled" ? claudeRes.value : null;
        if (localRes.status === "rejected") console.warn("自建模型檢測失敗：", localRes.reason);
        if (claudeRes.status === "rejected") {
            console.warn("Claude 檢測失敗：", claudeRes.reason);
            toast(t("ai_unavailable"), "warn", 6000);
        }
        ai = combineResults(local, claude);
    });
    if (!photos) return;

    // 2. 顯示 AI 結果：不合格就不能送出，合格 / 待確認可以送出給技師
    if (ai) {
        const verdict = aiVerdict(ai);
        const proceed = await openModal({
            title: t("ai_title"), wide: true,
            html: renderHybridReport(ai) + `<p class="ai-hint">${t("ai_hint_" + verdict)}</p>`,
            actions: verdict === "fail"
                ? [{ label: t("ai_retake"), value: false }]
                : [{ label: t("cancel_btn"), cls: "btn-ghost", value: false }, { label: t("ai_submit"), value: true }]
        });
        if (!proceed) return;
    }

    // 3. 送出申請
    await withBusy($("uploadBtn"), async () => {
        try {
            await addDoc(collection(db, "applications"), {
                studentId: state.user,
                createdAt: Date.now(),
                status: "pending",
                reason: "",
                photos,
                photoParts: parts,   // 每張照片拍的是哪個部位（和 photos 同順序）
                ai: ai || null
            });
            inputs.forEach(inp => { inp.value = ""; previewPhoto(inp); });
            toast(t("alt_upload_ok"), "success");
            go("member");
        } catch (e) {
            toast(errMsg(e), "error");
        }
    });
}

// ==========================================
// 🤖 AI 車況檢測
// ==========================================
async function runAiInspection(photos, parts) {
    const token = await auth.currentUser.getIdToken();
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

const aiVerdict = (ai) => (["pass", "fail", "review"].includes(ai?.verdict) ? ai.verdict : "review");
const clampScore = (n) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));
const CONDITIONS = ["good", "minor_wear", "moderate_wear", "severe", "not_visible"];

function aiBadge(ai) {
    if (!ai) return `<span class="badge badge-none">${t("ai_none")}</span>`;
    const v = aiVerdict(ai);
    const score = ai.score === null || ai.score === undefined ? "" : `${clampScore(ai.score)} · `;
    return `<span class="badge badge-ai-${v}">AI ${score}${t("ai_short_" + v)}</span>`;
}

// AI 報告內容來自資料庫，全部經過 esc() 處理
function renderAiReport(ai) {
    const L = state.lang === "zh" ? "zh" : "en";
    const v = aiVerdict(ai);
    const reasons = Array.isArray(ai["reasons_" + L]) ? ai["reasons_" + L] : [];
    const comps = Object.values(ai.components || {}).sort((a, b) => (b.weight || 0) - (a.weight || 0));
    return `<div class="ai-report">
        <div class="ai-verdict ai-${v}"><strong>${t("ai_verdict_" + v)}</strong><span>${t("ai_threshold", { n: clampScore(ai.passScore) })}</span></div>
        <div class="summary-grid ai-scores">
            <div><strong>${clampScore(ai.score)}</strong><span>${t("ai_score")}</span></div>
            <div><strong>${clampScore(ai.wearRate)}%</strong><span>${t("ai_wear")}</span></div>
        </div>
        ${reasons.length ? `<ul class="ai-reasons">${reasons.map(r => `<li>${esc(r)}</li>`).join("")}</ul>` : ""}
        <p class="ai-summary">${esc(ai["summary_" + L] || "")}</p>
        <ul class="ai-comps">${comps.map(c => {
            const cond = CONDITIONS.includes(c.condition) ? c.condition : "not_visible";
            return `<li>
                <div class="ai-comp-head"><span>${esc(c["name_" + L] || "")}</span><span class="badge badge-cond-${cond}">${t("cond_" + cond)}${cond === "not_visible" ? "" : ` · ${clampScore(c.score)}`}</span></div>
                ${cond === "not_visible" ? "" : `<div class="meter meter-${cond}"><span style="width:${clampScore(c.score)}%"></span></div>`}
                <p>${esc(c["finding_" + L] || "")}</p>
            </li>`;
        }).join("")}</ul>
        <p class="muted small">${t("ai_disclaimer")}</p>
    </div>`;
}

function openAiReport(ai) {
    if (!ai) return;
    openModal({ title: t("ai_title"), wide: true, html: renderHybridReport(ai), actions: [{ label: t("close"), cls: "btn-ghost" }] });
}

// ==========================================
// 🧠 自建模型（Teachable Machine）+ 與 Claude 合併判斷
// ==========================================
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
function loadLocalModel() {
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
async function runLocalModel(photos) {
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

// Claude 發現的硬性問題（自建模型沒學過的少見狀況），Claude 有否決權
function isHardFail(c) {
    return c.verdict === "fail" && (
        c.bikeType !== "standard" ||
        c.components?.frame?.condition === "severe" ||
        c.components?.wheels_tires?.condition === "severe");
}

// 合併規則：由上往下檢查，符合第一條就停止。回傳 null 代表兩邊都沒有結果
function combineResults(local, claude) {
    if (!local && !claude) return null;
    if (!local) return claude; // 沒有自建模型：與原本只用 Claude 的結果相同

    const localOk = !local.notBike && local.confidence >= LOCAL_MIN_CONFIDENCE;
    const localPass = localOk && local.score >= PASS_SCORE;

    let score = null;
    if (claude && localOk) score = Math.round(claude.score * CLAUDE_WEIGHT + local.score * (1 - CLAUDE_WEIGHT));
    else if (claude) score = claude.score;
    else if (localOk) score = local.score;

    let verdict, reasonKey;
    if (claude && isHardFail(claude)) {
        verdict = "fail"; reasonKey = "hy_hard_fail";
    } else if (local.notBike && local.confidence >= 0.7) {
        verdict = "review"; reasonKey = "hy_local_notbike";
    } else if (claude && claude.verdict === "review") {
        verdict = "review"; reasonKey = "hy_claude_review";
    } else if (claude && localOk) {
        const claudePass = claude.verdict === "pass";
        if (claudePass === localPass) { verdict = claudePass ? "pass" : "fail"; reasonKey = "hy_agree"; }
        else { verdict = "review"; reasonKey = "hy_disagree"; }
    } else if (claude) {
        verdict = claude.verdict; reasonKey = "hy_claude_only";
    } else if (localOk) {
        verdict = (!localPass && local.confidence >= 0.85) ? "fail" : "review"; reasonKey = "hy_local_only";
    } else {
        verdict = "review"; reasonKey = "hy_none";
    }
    return {
        hybrid: true, verdict, score, wearRate: score === null ? null : 100 - score,
        passScore: PASS_SCORE, reasonKey, local, claude, assessedAt: Date.now()
    };
}

const gradeName = (g) => (GRADES.includes(g) ? t("grade_" + g) : "-");
const pct = (n) => Math.round(Math.max(0, Math.min(1, Number(n) || 0)) * 100);

// 報告內容來自資料庫，數字都經過範圍限制、文字都經過 esc()
function renderHybridReport(r) {
    if (!r) return "";
    if (!r.hybrid) return renderAiReport(r); // 只有 Claude 的結果（舊資料或沒有自建模型）
    const v = aiVerdict(r);
    const local = r.local, claude = r.claude;
    const num = (n) => (n === null || n === undefined ? "–" : clampScore(n));
    const reason = String(r.reasonKey || "").startsWith("hy_") ? t(r.reasonKey) : "";
    const localBlock = local ? `
        <div class="hy-section">
            <h4>${t("hy_local_title")}</h4>
            <p class="muted small">${t("hy_local_grade", { g: esc(gradeName(local.topClass)), p: pct(local.confidence) })}</p>
            <ul class="hy-probs">${GRADES.map(g => `<li>
                <span>${esc(gradeName(g))}</span>
                <div class="meter meter-grade-${g}"><span style="width:${pct(local.probs?.[g])}%"></span></div>
                <b>${pct(local.probs?.[g])}%</b>
            </li>`).join("")}</ul>
        </div>` : "";
    return `<div class="ai-report">
        <div class="ai-verdict ai-${v}"><strong>${t("ai_verdict_" + v)}</strong><span>${t("ai_threshold", { n: clampScore(r.passScore) })}</span></div>
        <p class="hy-reason">${reason}</p>
        <div class="summary-grid ai-scores">
            <div><strong>${num(r.score)}</strong><span>${t("ai_score")}</span></div>
            <div><strong>${r.wearRate === null || r.wearRate === undefined ? "–" : clampScore(r.wearRate) + "%"}</strong><span>${t("ai_wear")}</span></div>
            <div><strong>${local ? num(local.score) : "–"}</strong><span>${t("hy_local_score")}</span></div>
            <div><strong>${claude ? num(claude.score) : "–"}</strong><span>${t("hy_claude_score")}</span></div>
        </div>
        ${localBlock}
        ${claude ? `<div class="hy-section"><h4>${t("hy_claude_title")}</h4>${renderAiReport(claude)}</div>` : `<p class="muted small">${t("ai_disclaimer")}</p>`}
    </div>`;
}

// ==========================================
// 👤 16. 會員專區
// ==========================================
function statusBadge(status) {
    return `<span class="badge badge-${esc(status)}">${t(status)}</span>`;
}

function renderMemberCenter() {
    const box = $("memberDisplay");
    if (!state.user) return;
    if (!state.userDoc) {
        box.innerHTML = `<p class="muted">${t("loading")}</p>`;
        return;
    }
    const u = state.userDoc;

    const ridesRows = state.rides.length
        ? state.rides.map(r => `<tr>
                <td>${fmtDateTime(r.startAt)}</td>
                <td class="mono">${esc(r.bikeId)}</td>
                <td>${fmtDuration(r.seconds)}</td>
                <td>${fmtNum(r.carbon)} g</td>
                <td>$${esc(r.fee ?? RIDE_FEE)}</td>
            </tr>`).join("")
        : `<tr><td colspan="5" class="empty">${t("no_rides")}</td></tr>`;

    const appRows = state.myApps.length
        ? state.myApps.map(a => {
            let note = "-";
            if (a.status === "approved") note = t("bonus_sent", { id: esc(a.bikeId || "-") });
            if (a.status === "rejected") note = esc(a.reason || t("default_reject"));
            const aiCell = a.ai ? ` <button type="button" class="badge-btn" data-ai-app="${esc(a.id)}">${aiBadge(a.ai)}</button>` : "";
            return `<tr><td>${fmtDateTime(a.createdAt)}</td><td>${statusBadge(a.status)}${aiCell}</td><td>${note}</td></tr>`;
        }).join("")
        : `<tr><td colspan="3" class="empty">${t("no_history")}</td></tr>`;

    box.innerHTML = `
        <p class="member-hi">${t("member_hi", { id: esc(state.user) })}</p>
        <div class="wallet-card">
            <h3>${t("wallet_title")}</h3>
            <div class="wallet-balance">$ ${fmtNum(u.balance)}</div>
            <div class="wallet-actions">
                <button type="button" class="btn btn-line" onclick="openLinePayMock()">${t("linepay_btn")}</button>
                <button type="button" class="btn btn-glass" onclick="redeemPromoCode()">${t("promo_btn")}</button>
            </div>
        </div>
        <div class="mini-stats">
            <div><strong>${fmtNum(u.rideCount)}</strong><span>${t("stat_rides")}</span></div>
            <div><strong>${fmtNum(u.totalCarbon)} g</strong><span>${t("stat_total_carbon")}</span></div>
        </div>
        <div class="surface section-block">
            <h4>${t("rides_title")}</h4>
            <div class="table-wrap"><table>
                <thead><tr><th>${t("th_date")}</th><th>${t("plate_label")}</th><th>${t("th_duration")}</th><th>${t("th_carbon")}</th><th>${t("th_fee")}</th></tr></thead>
                <tbody>${ridesRows}</tbody>
            </table></div>
        </div>
        <div class="surface section-block">
            <h4>${t("history_title")}</h4>
            <div class="table-wrap"><table>
                <thead><tr><th>${t("history_time")}</th><th>${t("history_status")}</th><th>${t("history_reason")}</th></tr></thead>
                <tbody>${appRows}</tbody>
            </table></div>
        </div>
        <button type="button" class="btn btn-ghost" onclick="changePassword()">${t("pwd_change_btn")}</button>`;
}

async function openLinePayMock() {
    const presets = [50, 100, 200, 500];
    const amount = await openModal({
        title: t("topup_title"),
        html: `<p>${t("prompt_linepay")}</p>
            <div class="amount-grid">${presets.map(n => `<button type="button" class="amount-chip" data-amount="${n}">$${n}</button>`).join("")}</div>
            <div class="input-group"><label for="topupAmount">${t("topup_custom")}</label><input id="topupAmount" type="number" inputmode="numeric" min="1" max="5000" step="1" placeholder="100"></div>`,
        actions: [
            { label: t("cancel_btn"), cls: "btn-ghost", value: null },
            {
                label: t("topup_next"), cls: "btn-line",
                onClick: (m) => {
                    const n = Number(m.querySelector("#topupAmount").value);
                    if (!Number.isInteger(n) || n < 1 || n > 5000) throw new AppError("err_amount");
                    return n;
                }
            }
        ]
    });
    if (!amount) return;

    const paid = await openModal({
        title: t("linepay_screen"),
        html: `<div class="linepay-box">
                <span class="linepay-logo">LINE Pay</span>
                <p class="linepay-amount">NT$ ${fmtNum(amount)}</p>
                <p class="muted">${t("linepay_confirm", { n: fmtNum(amount) })}</p>
            </div>`,
        actions: [
            { label: t("cancel_btn"), cls: "btn-ghost", value: false },
            {
                label: t("linepay_pay"), cls: "btn-line",
                onClick: async () => {
                    await sleep(1200); // 模擬 LINE Pay 授權等待
                    await setDoc(userRef(), { balance: increment(amount) }, { merge: true });
                    return true;
                }
            }
        ]
    });
    if (paid) toast(t("alt_line_ok", { n: fmtNum(amount) }), "success");
    else toast(t("alt_cancel"), "warn");
}

// 點選金額按鈕時帶入輸入框
document.addEventListener("click", (e) => {
    const chip = e.target.closest(".amount-chip");
    if (!chip) return;
    const modal = chip.closest(".modal");
    modal.querySelectorAll(".amount-chip").forEach(c => c.classList.toggle("selected", c === chip));
    modal.querySelector("#topupAmount").value = chip.dataset.amount;
});

async function redeemPromoCode() {
    const bonus = await openModal({
        title: t("promo_title"),
        html: `<div class="input-group"><label for="promoInput">${t("prompt_promo")}</label><input id="promoInput" maxlength="30" autocomplete="off" style="text-transform:uppercase"></div>`,
        actions: [
            { label: t("cancel_btn"), cls: "btn-ghost", value: null },
            {
                label: t("submit"),
                onClick: async (m) => {
                    const code = m.querySelector("#promoInput").value.trim().toUpperCase();
                    if (!code) return false;
                    const amount = PROMO_CODES[code];
                    if (!amount) throw new AppError("err_promo_invalid");
                    // 每個帳號每組序號只能兌換一次
                    await runTransaction(db, async (tx) => {
                        const uRef = userRef();
                        const u = (await tx.get(uRef)).data() || {};
                        if ((u.redeemedCodes || []).includes(code)) throw new AppError("err_promo_used");
                        tx.set(uRef, { balance: (u.balance || 0) + amount, redeemedCodes: arrayUnion(code) }, { merge: true });
                    });
                    return amount;
                }
            }
        ]
    });
    if (bonus) toast(t("alt_promo_ok", { n: bonus }), "success");
}

async function changePassword() {
    await openModal({
        title: t("pwd_title"),
        html: `<div class="input-group"><label for="pwdOld">${t("pwd_old")}</label><input id="pwdOld" type="password" autocomplete="current-password"></div>
            <div class="input-group"><label for="pwdNew">${t("pwd_new")}</label><input id="pwdNew" type="password" autocomplete="new-password" placeholder="${esc(t("reg_pwd_ph"))}"></div>
            <div class="input-group"><label for="pwdNew2">${t("pwd_new2")}</label><input id="pwdNew2" type="password" autocomplete="new-password"></div>`,
        actions: [
            { label: t("cancel_btn"), cls: "btn-ghost", value: null },
            {
                label: t("submit"),
                onClick: async (m) => {
                    const oldPwd = m.querySelector("#pwdOld").value;
                    const newPwd = m.querySelector("#pwdNew").value;
                    if (!oldPwd || !newPwd) throw new AppError("err_empty");
                    if (newPwd.length < 6) throw new AppError("err_pwd_short");
                    if (newPwd !== m.querySelector("#pwdNew2").value) throw new AppError("err_pwd_mismatch");
                    const user = auth.currentUser;
                    try {
                        await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, oldPwd));
                    } catch (e) {
                        if (["auth/invalid-credential", "auth/wrong-password", "auth/invalid-login-credentials"].includes(e.code)) throw new AppError("err_old_pwd");
                        throw e;
                    }
                    await updatePassword(user, newPwd);
                    toast(t("pwd_changed"), "success");
                }
            }
        ]
    });
}

// ==========================================
// 🌍 17. 減碳貢獻
// ==========================================
function renderCarbon(withLeaderboard) {
    const u = state.userDoc || {};
    const daily = u.lastRideDate === todayStr() ? (u.dailyCarbon || 0) : 0; // 跨日自動歸零
    const total = u.totalCarbon || 0;
    $("dailyCarbon").textContent = fmtNum(daily);
    $("totalCarbon").textContent = fmtNum(total);
    $("carbonTree").textContent = t("carbon_tree", { n: (total / TREE_GRAMS_PER_DAY).toFixed(1) });
    $("carbonRides").textContent = fmtNum(u.rideCount);
    $("carbonKm").textContent = (total / CARBON_PER_KM).toFixed(1);
    if (withLeaderboard) loadLeaderboard();
}

async function loadLeaderboard() {
    const list = $("leaderboard");
    list.innerHTML = `<li class="lb-empty muted">${t("loading")}</li>`;
    try {
        const snap = await getDocs(collection(db, "users"));
        const rows = snap.docs
            .map(d => ({ id: d.id, total: d.data().totalCarbon || 0 }))
            .filter(r => r.total > 0)
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);
        list.innerHTML = rows.length
            ? rows.map(r => `<li class="${r.id === state.user ? "is-me" : ""}">
                    <span class="lb-name mono">${esc(maskId(r.id))}${r.id === state.user ? t("leader_me") : ""}</span>
                    <span class="lb-value">${fmtNum(r.total)} g</span>
                </li>`).join("")
            : `<li class="lb-empty muted">${t("leader_empty")}</li>`;
    } catch (e) {
        list.innerHTML = `<li class="lb-empty muted">${esc(t("err_db"))}</li>`;
    }
}

// ==========================================
// 👨‍🔧 18. 技師後台
// ==========================================
function renderAdminDashboard() {
    if (!state.isAdmin) return;
    const bikes = Object.entries(state.bikes).sort(([a], [b]) => a.localeCompare(b));
    const count = (s) => bikes.filter(([, b]) => b.status === s).length;
    const pendingApps = state.admin.apps.filter(a => a.status === "pending");
    const openRepairs = state.admin.repairs.filter(r => r.status === "open");

    $("adminStats").innerHTML = [
        ["s-green", count("active"), t("st_active")],
        ["s-orange", count("rented"), t("st_rented")],
        ["s-red", count("maintenance"), t("st_maint")],
        ["s-blue", pendingApps.length, t("st_pending")],
        ["s-red", openRepairs.length, t("st_repairs")]
    ].map(([cls, n, label]) => `<div class="admin-stat ${cls}"><strong>${n}</strong><span>${label}</span></div>`).join("");

    $("adminApprovalTable").innerHTML = pendingApps.length
        ? pendingApps.map(a => `<tr>
                <td class="mono">${esc(a.studentId)}</td>
                <td>${fmtDateTime(a.createdAt)}<br><small class="muted">${t("appr_photo_msg")}</small></td>
                <td><div class="thumbs">${(a.photos || []).filter(p => String(p).startsWith("data:image/"))
                    .map((p, i) => {
                        const key = a.photoParts?.[i] || OLD_PHOTO_KEYS[i] || "extra";
                        const label = esc(t("part_" + key));
                        return `<img src="${esc(p)}" alt="${label}" title="${label}" data-act="photo" data-part="${esc(key)}">`;
                    }).join("")}</div></td>
                <td>${a.ai ? `<button type="button" class="badge-btn" data-act="ai" data-id="${esc(a.id)}">${aiBadge(a.ai)}</button>` : aiBadge(null)}</td>
                <td><div class="admin-actions">
                    <button type="button" class="btn btn-sm btn-primary" data-act="approve" data-id="${esc(a.id)}">${t("btn_approve")}</button>
                    <button type="button" class="btn btn-sm btn-danger" data-act="reject" data-id="${esc(a.id)}">${t("btn_reject")}</button>
                </div></td>
            </tr>`).join("")
        : `<tr><td colspan="5" class="empty">${t("empty_appr")}</td></tr>`;

    $("adminRepairTable").innerHTML = openRepairs.length
        ? openRepairs.map(r => `<tr>
                <td class="mono strong" style="color:var(--danger)">${esc(r.bikeId)}</td>
                <td class="cell-msg">${esc(r.desc)}${(r.photos || []).length ? `<div class="thumbs repair-photos">${r.photos
                    .filter(p => String(p).startsWith("data:image/"))
                    .map((p, i) => `<img src="${esc(p)}" alt="${esc(t("rep_photo_alt", { n: i + 1 }))}" title="${esc(t("rep_photo_alt", { n: i + 1 }))}" data-act="photo">`).join("")}</div>` : ""}</td>
                <td>${esc(r.reporter || "-")}<br><small class="muted">${fmtDateTime(r.createdAt)}</small></td>
                <td><button type="button" class="btn btn-sm btn-primary" data-act="fix" data-id="${esc(r.id)}" data-bike="${esc(r.bikeId)}">${t("btn_fix")}</button></td>
            </tr>`).join("")
        : `<tr><td colspan="4" class="empty">${t("empty_rep")}</td></tr>`;

    $("adminFleetTable").innerHTML = bikes.length
        ? bikes.map(([id, b]) => {
            let action = "-";
            if (b.status === "active") action = `<button type="button" class="btn btn-sm btn-ghost" data-act="offline" data-bike="${esc(id)}">${t("btn_offline")}</button>`;
            if (b.status === "maintenance") action = `<button type="button" class="btn btn-sm btn-primary" data-act="online" data-bike="${esc(id)}">${t("btn_online")}</button>`;
            return `<tr>
                <td class="mono strong">${esc(id)}</td>
                <td><span class="badge badge-${esc(b.status)}">${t("status_" + b.status)}</span></td>
                <td>${esc(b.rentedBy || "-")}</td>
                <td class="mono small">${Number(b.lat).toFixed(5)}, ${Number(b.lng).toFixed(5)}</td>
                <td>${action}</td>
            </tr>`;
        }).join("")
        : `<tr><td colspan="5" class="empty">${t("loading")}</td></tr>`;

    $("adminFeedbackTable").innerHTML = state.admin.feedback.length
        ? state.admin.feedback.map(f => `<tr>
                <td>${fmtDateTime(f.createdAt)}</td>
                <td>${esc(f.name || f.user || "-")}</td>
                <td>${esc(f.contact || "-")}</td>
                <td class="cell-msg">${esc(f.message)}</td>
            </tr>`).join("")
        : `<tr><td colspan="4" class="empty">${t("no_feedback")}</td></tr>`;
}

// 後台按鈕統一處理
$("adminSection").addEventListener("click", async (e) => {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const { act, id, bike } = el.dataset;
    if (act === "photo") {
        const key = el.dataset.part;
        return openModal({ title: key ? t("part_" + key) : t("photo_title"), wide: true, html: `<img class="modal-img" src="${esc(el.getAttribute("src"))}" alt="">`, actions: [{ label: t("close"), cls: "btn-ghost" }] });
    }
    if (act === "ai") return openAiReport(state.admin.apps.find(a => a.id === id)?.ai);
    try {
        if (act === "approve") await withBusy(el, () => approveBike(id));
        if (act === "reject") await rejectBike(id);
        if (act === "fix") await withBusy(el, () => resolveRepair(id, bike));
        if (act === "offline") await withBusy(el, () => setBikeStatus(bike, "maintenance"));
        if (act === "online") await withBusy(el, () => setBikeStatus(bike, "active"));
    } catch (err) {
        toast(errMsg(err), "error");
    }
});

function bikePhotosFromApplication(appData) {
    const photos = {};
    (appData.photos || []).forEach((src, i) => {
        const key = appData.photoParts?.[i] || OLD_PHOTO_KEYS[i] || "extra";
        if (String(src).startsWith("data:image/") && !photos[key]) photos[key] = { src };
    });
    const ai = appData.ai;
    const condition = ai && Number.isFinite(Number(ai.score)) ? { score: clampScore(ai.score), wearRate: clampScore(ai.wearRate) } : null;
    return { photos, condition, source: "application", appId: appData.id, updatedAt: Date.now() };
}

async function approveBike(appId) {
    const appData = state.admin.apps.find(a => a.id === appId);
    if (!appData) return;
    // 新車牌：目前最大編號 + 1，例如 NCU-003
    const nums = Object.keys(state.bikes).map(k => parseInt(k.replace(/\D/g, ""), 10)).filter(Number.isFinite);
    const newBikeId = "NCU-" + String(Math.max(0, ...nums) + 1).padStart(3, "0");
    const lat = CAMPUS[0] + (Math.random() - 0.5) * 0.005;
    const lng = CAMPUS[1] + (Math.random() - 0.5) * 0.005;

    await runTransaction(db, async (tx) => {
        const aRef = doc(db, "applications", appId), bRef = doc(db, "bikes", newBikeId);
        const aSnap = await tx.get(aRef);
        const bSnap = await tx.get(bRef);
        if (aSnap.data()?.status !== "pending") throw new AppError("err_generic");
        if (bSnap.exists()) throw new AppError("err_generic");
        tx.set(bRef, { lat, lng, status: "active", rentedBy: null, createdAt: Date.now(), source: appId });
        tx.update(aRef, { status: "approved", bikeId: newBikeId, reviewedAt: Date.now() });
        // 申請時拍的部位照片，變成地圖上這台車的照片（點線稿就能看到）
        tx.set(doc(db, "bikePhotos", newBikeId), bikePhotosFromApplication(appData));
        // 獎勵金直接加到申請學生的雲端帳戶
        tx.set(doc(db, "users", appData.studentId), { balance: increment(APPROVE_BONUS) }, { merge: true });
    });
    toast(t("alt_approve_ok", { id: newBikeId, student: appData.studentId }), "success", 5000);
}

async function rejectBike(appId) {
    await openModal({
        title: t("reject_title"),
        html: `<div class="input-group"><label for="rejectReason">${t("prompt_reject")}</label><textarea id="rejectReason" rows="3" maxlength="200" placeholder="${esc(t("default_reject"))}"></textarea></div>`,
        actions: [
            { label: t("cancel_btn"), cls: "btn-ghost", value: null },
            {
                label: t("btn_reject"), cls: "btn-danger",
                onClick: async (m) => {
                    const reason = m.querySelector("#rejectReason").value.trim() || t("default_reject");
                    await updateDoc(doc(db, "applications", appId), { status: "rejected", reason, reviewedAt: Date.now() });
                    toast(t("alt_reject_ok"), "warn");
                }
            }
        ]
    });
}

async function resolveRepair(repairId, bikeId) {
    const batch = writeBatch(db);
    // 同一台車的所有待修單一起結案
    state.admin.repairs
        .filter(r => r.status === "open" && (r.id === repairId || r.bikeId === bikeId))
        .forEach(r => batch.update(doc(db, "repairs", r.id), { status: "fixed", fixedAt: Date.now() }));
    if (state.bikes[bikeId]?.status === "maintenance") {
        batch.update(doc(db, "bikes", bikeId), { status: "active", updatedAt: Date.now() });
    }
    await batch.commit();
    toast(t("alt_fix_ok", { id: bikeId }), "success");
}

async function setBikeStatus(bikeId, status) {
    await runTransaction(db, async (tx) => {
        const bRef = doc(db, "bikes", bikeId);
        const b = (await tx.get(bRef)).data();
        if (!b) throw new AppError("err_bike_unavailable");
        if (b.status === "rented") throw new AppError("err_bike_in_use");
        tx.update(bRef, { status, updatedAt: Date.now() });
    });
}

// ==========================================
// 🚀 19. 啟動
// ==========================================
// 網頁的全域事件
window.addEventListener("hashchange", () => showRoute(currentRoute()));
window.addEventListener("click", closeDropdown);
document.addEventListener("click", (e) => {
    const info = e.target.closest("[data-info]");
    if (info) openInfo(info.dataset.info);
});
$("inputEPassword").addEventListener("keydown", (e) => { if (e.key === "Enter") confirmRent(); });
// 車輛面板：點線稿的部位或下方的部位按鈕
$("rentVerifyPanel").addEventListener("click", (e) => {
    const el = e.target.closest("#bikeBlueprint [data-part], #bikePartChips [data-part]");
    if (el) showBikePart(el.dataset.part);
});
$("bikeBlueprint").addEventListener("keydown", (e) => {
    const el = e.target.closest("[data-part]");
    if (el && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); showBikePart(el.dataset.part); }
});
$("memberSection").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-ai-app]");
    if (btn) openAiReport(state.myApps.find(a => a.id === btn.dataset.aiApp)?.ai);
});

// 每秒更新：騎乘計時、模擬車機螢幕
setInterval(() => {
    tickRide();
    tickBikeScreen();
}, 1000);

// 讓 HTML 的 onclick 可以呼叫模組內的函式
Object.assign(window, {
    go, t, switchView, changeLang, toggleTheme, scrollToStory,
    handleLogin, handleRegister, logout, switchAccount, toggleUserDropdown, showForgotPassword,
    enterMap, enterMemberPage, enterRepairPage, enterCarbonPage,
    openLinePayMock, redeemPromoCode, changePassword,
    previewPhoto, confirmBikeUpload, submitRepair, previewRepairPhotos,
    confirmRent, closeRentPanel, returnBike, locateMe, loginToRent
});

// AI 客服 (Botpress) 的泡泡在 Shadow DOM 裡，外部 CSS 改不到，所以用程式注入樣式：
// 手機版把泡泡往上移，避免擋住底部選單
function adjustChatWidget() {
    let tries = 0;
    const timer = setInterval(() => {
        const root = document.querySelector("#fab-root")?.shadowRoot;
        if (root && !root.getElementById("ncu-fab-fix")) {
            const style = document.createElement("style");
            style.id = "ncu-fab-fix";
            style.textContent = `@media (max-width: 760px) {
                .bpFabWrapper { bottom: 84px !important; }
                .bpMessagePreview { bottom: 156px !important; }
            }`;
            root.appendChild(style);
        }
        if (root || ++tries > 60) clearInterval(timer);
    }, 500);
}
adjustChatWidget();

// 初始化
renderPhotoSlots(); // 要在 changeLang 之前，拍攝格的文字才會套用語言
setTheme(document.documentElement.getAttribute("data-theme") || "light", false);
let savedLang = "zh";
try { savedLang = localStorage.getItem("NCU_Bikes_Lang") || "zh"; } catch (e) { /* 無痕模式 */ }
changeLang(savedLang);
try {
    if (sessionStorage.getItem("NCU_admin") === "1") { state.isAdmin = true; startAdminSubs(); }
} catch (e) { /* 無痕模式 */ }
renderUserMenu();
startBikeSub();
// Firebase 太久沒回應時，仍然先顯示頁面
setTimeout(() => {
    if (!authReady) { authReady = true; showRoute(currentRoute()); }
}, 4000);
