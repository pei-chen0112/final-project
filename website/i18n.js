// ==========================================
// 💡 雙語字典 (i18n)
// 文字中的 {name} 會由 t(key, { name: value }) 代入
// ==========================================
export const translations = {
    zh: {
        // ---------- 共用 ----------
        brand: "中大愛心綠色腳踏車",
        ok: "確定", cancel_btn: "取消", close: "關閉", submit: "送出", dlg_confirm: "請確認", loading: "載入中…",
        back: "❮ 返回",
        err_generic: "發生錯誤：{msg}",
        err_network: "網路連線失敗，請稍後再試",
        err_db: "無法連線至資料庫，請檢查網路！",
        need_login: "請先登入系統才能使用此功能！",

        // ---------- 導覽 ----------
        nav_donate: "捐車規範", nav_guide: "使用說明", nav_contact: "聯絡我們", nav_faq: "常見問題",
        menu_home: "首頁", menu_title: "中大愛心綠色腳踏車", menu_map: "地圖尋車", menu_member: "會員專區", menu_repair: "車輛報修", menu_carbon: "減碳貢獻",
        btn_login_nav: "登入", btn_logout_nav: "登出系統", btn_switch_nav: "切換帳號", logout: "登出",
        admin_name: "👨‍🔧 技師",
        theme_toggle: "切換深淺色模式",

        // ---------- 首頁 Hero ----------
        hero_tag: "🌱 復活中央小綠綠計畫",
        hero_title: "在松林間，<br>騎回綠色校園",
        hero_desc: "無固定站點、隨借隨還，單次騎乘只要 $5。登入後打開地圖，就能找到離你最近的小綠綠。",
        hero_cta_map: "🚲 立即找車",
        hero_cta_story: "了解計畫",
        stat_available: "目前可租借",
        stat_fee: "單次騎乘",
        stat_carbon_rate: "每公里減碳",

        // ---------- 首頁 使用流程 ----------
        guide_title: "使用中大綠色腳踏車",
        guide_step1: "註冊 / 登入", guide_desc1: "使用學號或帳號<br>登入網頁系統",
        guide_step2: "解鎖 / 租借", guide_desc2: "地圖尋找附近車輛<br>輸入密碼解鎖",
        guide_step3: "輕鬆騎乘", guide_desc3: "享受松林間的<br>綠色低碳時光",
        guide_step4: "隨處還車", guide_desc4: "停放於安全區域<br>點擊結束騎乘",

        // ---------- 首頁 故事 ----------
        story_title: "讓校園再次「綠」起來：重拾中央小綠綠的單車回憶",
        img_caption1: "回憶中穿梭在松林間的翠綠身影",
        story_p1: "如果你是在 2010 年左右漫步在中央大學的校園，你一定會注意到那一抹穿梭在松林間的鮮豔色彩——「中央小綠綠」。",
        story_sub1: "什麼是「中央小綠綠」？",
        story_p2: "「中央小綠綠」是中央大學於 2010 年前後發起的校園綠色腳踏車計畫。在那個 YouBike 尚未普及的年代，學校為了推廣低碳校園、減輕校內機車負擔，特別購置了一批翠綠色的單車。這些腳踏車採取「公共共享」的概念，讓學生與教職員能自由騎乘於教學區、宿舍與餐廳之間，是許多中大人心中共同的校園標誌。",
        story_sub2: "我們的目標：復活綠色傳奇",
        story_p3: "然而，隨著時間推移，車輛損耗、維護經費不足以及管理機制等挑戰，讓這群綠色身影逐漸消失在校園的角落，最終走入了歷史。",
        story_p4: "雖然「小綠綠」退場了，但當初那份永續校園與共享便捷的初心不應被遺忘。在 2026 年的今天，面對氣候變遷與減碳轉型的浪潮，我們立志要「復活中央小綠綠計畫」。",
        story_p5: "我們不只是想帶回那輛腳踏車，更是要結合現代的數位管理與社群力量：",
        goal_1: "<strong>優化管理：</strong> 引入智慧門鎖與 App 追蹤，解決當年車輛遺失與維修不明的問題。",
        goal_2: "<strong>循環經濟：</strong> 建立校內維修社群，讓修車成為一種技能傳承，減少資源浪費。",
        goal_3: "<strong>低碳生活：</strong> 讓腳踏車再次成為中大人校內通勤的首選，找回慢活的松林美景。",

        // ---------- 頁尾 ----------
        footer_terms: "服務條款", footer_privacy: "隱私權政策", footer_contact: "聯絡客服",
        footer_copy: "© 2026 國立中央大學 National Central University. All Rights Reserved.",
        footer_disclaimer: "*本網站為學生專案展示，非學校官方正式營運系統。",

        // ---------- 登入 / 註冊 ----------
        login_sub: "中大愛心綠色腳踏車",
        id_label: "中央大學信箱", pwd_label: "密碼",
        login_school_note: "🎓 僅限中央大學 Google 信箱（@g.ncu.edu.tw）登入",
        reg_school_note: "註冊後會寄驗證信到你的中央大學信箱（@g.ncu.edu.tw），完成驗證才能使用",
        verify_title: "驗證學校信箱",
        verify_desc: "我們已寄出驗證信到",
        verify_step1: "登入中央大學 Google 信箱（Gmail），打開驗證信",
        verify_step2: "點選信中的驗證連結",
        verify_step3: "回到這裡，按下「我已完成驗證」",
        verify_done_btn: "我已完成驗證",
        verify_resend_btn: "重新寄送驗證信",
        verify_spam: "沒收到嗎？請檢查垃圾郵件匣，或稍後重新寄送。",
        verify_other: "使用其他帳號",
        verify_not_yet: "還沒有完成驗證，請先點選中央大學信箱中的驗證連結",
        verify_sent: "✅ 驗證信已重新寄出",
        verify_ok: "✅ 學校信箱驗證完成，歡迎使用！",
        verify_wait: "請等 {s} 秒後再重新寄送",
        err_old_account: "系統已改為只限中央大學信箱（@g.ncu.edu.tw）登入，舊帳號已停用，請用學校信箱重新註冊。",
        forget_desc: "輸入你的中央大學信箱，我們會寄送重設密碼信到這個信箱（@g.ncu.edu.tw）。",
        forget_send: "寄送重設信",
        forget_sent: "✅ 已寄出重設密碼信到 {email}，請到學校信箱查看。",
        id_ph: "技師請輸入 admin", pwd_ph: "技師密碼 admin123",
        login_btn: "登入系統", go_reg: "還沒有帳號？ 前往註冊", forget_pwd: "忘記密碼",
        err_login: "帳密錯誤或尚未註冊",
        login_welcome: "歡迎回來，{id}！",
        logged_out: "已登出",
        reg_title: "📝 新增學生帳號",
        reg_id_label: "中央大學信箱", reg_pwd_label: "設定密碼", reg_pwd2_label: "確認密碼",
        reg_id_ph: "例如 dkchan", reg_pwd_ph: "至少 6 個字元", reg_pwd2_ph: "再輸入一次密碼",
        reg_btn: "立即開通帳號", back_login: "已有帳號？ 返回登入",
        alt_reg_ok: "✅ 註冊成功！驗證信已寄到你的中央大學信箱",
        err_id_format: "請輸入中央大學信箱 @ 前面的帳號（英文字母、數字、. - _）",
        err_email_domain: "只接受中央大學 Google 信箱（@g.ncu.edu.tw）",
        err_pwd_short: "密碼至少需要 6 個字元",
        err_pwd_mismatch: "兩次輸入的密碼不一致",
        err_id_taken: "這個學號已經註冊過了",
        err_too_many: "嘗試次數過多，請稍後再試",
        forget_title: "忘記密碼",
        alt_forget: "本系統以學號登入，無法寄送重設密碼信件。請攜帶學生證至校內腳踏車修理站，或聯繫計中 / 系統管理員協助重置密碼。",

        // ---------- 地圖 / 租借 ----------
        map_title: "地圖尋車",
        map_available: "可租借 {n} 台",
        map_locate: "📍 我的位置",
        err_geo: "無法取得您的位置",
        unlock_title: "解鎖車輛",
        unlock_desc: "無固定站點借還，單次騎乘將扣除帳戶餘額 <strong>$5</strong>",
        plate_label: "車牌號碼",
        pwd_warn: "*請查看實體腳踏車電子螢幕上的 4 位數密碼",
        pwd_ph2: "輸入 4 位數電子密碼",
        screen_title: "模擬車機螢幕（展示用）",
        screen_refresh: "{s} 秒後更新",
        unlock_btn: "帳戶餘額付款並解鎖",
        err_pin_format: "請輸入 4 位數密碼",
        err_renting: "❌ 您已經有一台租借中的車輛！",
        err_bal: "❌ 帳戶餘額不足 (單次騎乘需 5 元)！請先至會員專區儲值。",
        err_pwd: "❌ 電子密碼驗證失敗！請確認實體車機螢幕上的最新密碼。",
        err_bike_unavailable: "這台車目前無法租借，可能剛被別人借走了",
        alt_rent_ok: "✅ 付款成功！已扣款 5 元（餘額 {bal} 元），車輛解鎖，開始計時！",
        riding_title: "🚲 騎乘中：",
        gps_monitor: "GPS 追蹤監控運行中",
        ride_carbon_live: "已減碳 {g} 克",
        ride_pill: "騎乘中 {id} · {time}",
        return_btn: "⏹️ 結束騎乘並 GPS 還車",
        return_working: "定位並還車中…",
        ret_title: "✅ 還車成功",
        ret_duration: "騎乘時間",
        ret_distance: "估計距離",
        ret_carbon: "減少碳排",
        ret_fee: "本次扣款",
        ret_outside: "您目前不在校園範圍內，車輛已登記在地圖顯示的位置。",
        status_active: "可租借", status_rented: "租借中", status_maintenance: "維修中",

        // ---------- 報修 ----------
        repair_title: "車輛報修",
        repair_warn: "⚠️ 報修後車輛將立刻從地圖隱藏，請牽至修理站維修。",
        rep_id_label: "故障車牌號碼", rep_select_ph: "請選擇車輛",
        rep_desc_label: "損壞狀況描述", rep_desc_ph: "例如：煞車失靈、鏈條脫落",
        repair_btn: "通報損壞腳踏車",
        err_empty: "請填寫完整資訊！",
        err_bike_in_use: "這台車正在被租借中，無法報修",
        err_return_first: "請先結束騎乘再報修這台車",
        err_already_maint: "這台車已在維修中，技師會盡快處理",
        alt_rep_ok: "✅ 已通報並下線該車輛！請牽至修理站。",
        rep_photo_label: "損壞部位照片（1–3 張）",
        rep_photo_hint: "請提供車輛全景與損壞部位近照，供維修及 AI 判讀使用。",
        rep_photo_alt: "報修照片 {n}",
        err_rep_photo_none: "請至少選擇一張損壞部位照片！",
        err_rep_photo_many: "最多選擇 3 張照片！",
        err_rep_photo_type: "請使用 JPG、PNG 或 WebP 圖片！",
        err_rep_photo_size: "每張照片請勿超過 5 MB！",

        // ---------- 回收申請 / 上傳 ----------
        reclaim_title: "🚲 回收校園廢棄車輛",
        reclaim_desc: "1. 牽至【校內修理站】進行規格改裝。<br>2. 註冊系統並安裝 GPS 電子鎖。<br>技師上架後，系統自動回饋 <strong>$50 帳戶儲值金</strong>！",
        reclaim_btn: "前往填寫回收申請單",
        upload_title: "車輛照片上傳",
        upload_h3: "📸 提供車輛檢測照片",
        upload_desc: "請依照每一格的指示，拍攝整台車與指定部位的照片（7 張必拍、1 張選填）。照片會交給 AI 檢測車況，審核通過後，方可牽至修理站。",
        part_whole_side: "整體側面", part_whole_front: "整體正面", part_frame: "車架", part_wheels: "輪框與輪胎",
        part_brakes: "煞車", part_chain: "鏈條與齒盤", part_cockpit: "座墊與把手", part_extra: "其他損壞處", part_whole: "整台車",
        hint_whole_side: "站在車子側面約 2 公尺，整台車都要入鏡",
        hint_whole_front: "從車頭正前方拍，把手與前輪都要清楚",
        hint_frame: "車架三角與焊接處，有裂痕或凹陷要拍清楚",
        hint_wheels: "輪胎胎紋與輪框特寫，拍狀況較差的那一輪",
        hint_brakes: "煞車夾器與煞車皮特寫",
        hint_chain: "鏈條與大齒盤特寫，要看得出鏽蝕程度",
        hint_cockpit: "座墊表面、把手與煞車把手",
        hint_extra: "有其他明顯損壞時再拍",
        tag_required: "必拍", tag_optional: "選填",
        upload_count: "已完成 {n} / {total} 張必拍照片",
        err_upload_parts: "❌ 還缺少這些照片：{parts}",
        bike_tap_part: "點選線稿上的部位，查看該部位的照片",
        bike_no_photos: "這台車還沒有照片",
        bike_no_part_photo: "這個部位還沒有照片",
        bike_photo_credit: "照片",
        bike_condition: "上架時車況 {score} 分・損耗率 {wear}%",
        bike_login_to_rent: "登入後即可解鎖這台車",
        bike_loading_photos: "照片載入中…",
        pic1_label: "1. 車輛正面照", pic2_label: "2. 車輛側面照", pic3_label: "3. 局部特寫 / 損壞處",
        pick_photo: "點擊選擇照片",
        upload_submit: "確認上傳並送出申請",
        upload_working: "照片壓縮上傳中…",
        err_upload: "❌ 請務必上傳滿 3 張車輛照片才能送出申請！",
        err_img: "無法讀取這張圖片，請換一張",
        err_too_big: "照片檔案太大，請換解析度較低的照片",
        alt_upload_ok: "✅ 照片與申請已送出！請隨時至會員專區查看審核進度。",

        // ---------- AI 車況檢測 ----------
        ai_checking: "🤖 AI 正在檢測車況，約需 10–30 秒…",
        ai_unavailable: "Claude AI 檢測暫時無法使用，結果將交由技師確認。",
        hy_hard_fail: "Claude 發現不符回收規範的問題（例如車架斷裂、電動車、不是腳踏車）",
        hy_local_notbike: "自建模型認為照片中不是可回收的腳踏車，或照片看不清楚",
        hy_claude_review: "Claude 無法完全判斷這台車",
        hy_agree: "自建模型與 Claude 的意見一致",
        hy_disagree: "自建模型與 Claude 的意見不同，交給技師判斷",
        hy_claude_only: "自建模型信心不足，採用 Claude 的判斷",
        hy_local_only: "Claude 暫時無法使用，只採用自建模型的判斷",
        hy_none: "兩個模型都無法判斷，交給技師",
        hy_local_title: "🧠 自建模型",
        hy_claude_title: "🤖 Claude 逐部位分析",
        hy_local_grade: "判斷為「{g}」，信心 {p}%",
        hy_local_score: "自建模型分數",
        hy_claude_score: "Claude 分數",
        grade_A: "A 良好", grade_B: "B 輕微磨損", grade_C: "C 中度磨損", grade_D: "D 嚴重損壞", grade_X: "X 無法使用",
        ai_title: "🤖 AI 車況檢測結果",
        ai_verdict_pass: "✅ 初步判定合格",
        ai_verdict_fail: "❌ 未達回收標準",
        ai_verdict_review: "⚠️ 需要技師確認",
        ai_short_pass: "合格", ai_short_fail: "不合格", ai_short_review: "待確認",
        ai_score: "車況分數",
        ai_wear: "損耗率",
        ai_threshold: "合格門檻 {n} 分",
        ai_hint_pass: "送出後由技師做最終確認。",
        ai_hint_review: "AI 無法完全判斷這台車，送出後將由技師人工審核。",
        ai_hint_fail: "這台車目前不符合回收標準。可以換更清楚的照片再試一次，或改申請其他車輛。",
        ai_submit: "送出申請",
        ai_retake: "重新選擇照片",
        ai_none: "未檢測",
        ai_disclaimer: "AI 判斷僅供參考，最終結果以技師審核為準。",
        th_ai: "AI 檢測",
        cond_good: "良好", cond_minor_wear: "輕微磨損", cond_moderate_wear: "中度磨損", cond_severe: "嚴重損壞", cond_not_visible: "看不到",

        // ---------- 會員專區 ----------
        member_title: "會員專區",
        member_hi: "嗨，{id} 👋",
        wallet_title: "會員帳戶餘額",
        linepay_btn: "💬 LINE Pay 儲值",
        promo_btn: "🎁 序號兌換",
        pwd_change_btn: "🔒 修改密碼",
        stat_rides: "騎乘次數",
        stat_total_carbon: "累積減碳",
        topup_title: "💬 LINE Pay 儲值",
        topup_custom: "或輸入自訂金額",
        topup_next: "前往付款",
        prompt_linepay: "請選擇或輸入想透過 LINE Pay 儲值的金額",
        err_amount: "❌ 請輸入 1–5000 之間的整數金額！",
        linepay_screen: "LINE Pay 付款（模擬畫面）",
        linepay_confirm: "是否確認支付 台幣 {n} 元？",
        linepay_pay: "確認付款",
        alt_line_ok: "✅ LINE Pay 交易成功！已儲值 {n} 元",
        alt_cancel: "❌ 交易已取消。",
        promo_title: "🎁 序號兌換",
        prompt_promo: "請輸入您的點數儲值序號：",
        err_promo_used: "❌ 兌換失敗：您已經使用過這組序號了！",
        err_promo_invalid: "❌ 兌換失敗：無效的序號！",
        alt_promo_ok: "🎉 兌換成功！獲得 {n} 元儲值金！",
        pwd_title: "🔒 修改密碼",
        pwd_old: "目前密碼", pwd_new: "新密碼", pwd_new2: "確認新密碼",
        pwd_changed: "✅ 密碼已更新",
        err_old_pwd: "目前密碼不正確",
        rides_title: "🚲 騎乘紀錄",
        no_rides: "尚無騎乘紀錄，去地圖借一台車吧！",
        th_date: "日期", th_duration: "時間", th_carbon: "減碳", th_fee: "費用",
        history_title: "📜 廢棄車回收申請紀錄",
        history_time: "時間", history_status: "狀態", history_reason: "備註 / 原因",
        no_history: "尚無申請紀錄",
        pending: "⏳ 審核中", approved: "✅ 已通過", rejected: "❌ 未通過",
        bonus_sent: "已發放 $50，車牌 {id}",

        // ---------- 減碳 ----------
        carbon_title: "減碳貢獻",
        carbon_h3: "🌍 您的綠色足跡",
        carbon_p: "依據歐洲自行車聯盟的研究基準，以自行車取代燃油車，平均每騎乘 1 公里可減少約 <strong>250 克</strong> 的碳排放（以平均時速 15 公里估算）。",
        carbon_today: "本日節碳量", carbon_total: "累積總節碳量", carbon_unit: "克", carbon_unit2: "克",
        carbon_rides: "騎乘次數",
        carbon_km: "估計騎乘公里",
        carbon_tree: "🌳 約等於 {n} 棵樹一天的吸碳量",
        leader_title: "🏆 校園減碳排行榜",
        leader_me: "（你）",
        leader_empty: "還沒有人上榜，騎一趟成為第一名吧！",

        // ---------- 技師後台 ----------
        admin_title: "👨‍🔧 腳踏車修理站 - 技師管理後台",
        st_active: "可租借", st_rented: "租借中", st_maint: "維修中", st_pending: "待審申請", st_repairs: "待修車輛",
        admin_appr_title: "🚲 待改裝與註冊車輛（已附照片）",
        admin_rep_title: "🔧 待修復車輛清單",
        admin_fleet_title: "🗺️ 車隊總覽",
        admin_fb_title: "💬 使用者意見",
        th_student: "申請學生", th_time: "申請時間", th_action: "操作", th_photos: "照片",
        th_bike: "報修車號", th_desc: "損壞描述", th_reporter: "通報者",
        th_status: "狀態", th_location: "位置", th_rider: "租借者",
        th_name: "姓名", th_contact: "聯絡方式", th_msg: "內容",
        empty_rep: "無待修車輛", empty_appr: "無待安裝車輛", no_feedback: "尚無意見",
        appr_photo_msg: "點照片可放大",
        btn_approve: "通過核准", btn_reject: "退回", btn_fix: "修復上架",
        btn_offline: "下架", btn_online: "上架",
        reject_title: "退回申請",
        prompt_reject: "請輸入退回 / 未通過原因（例如：照片不清晰、非校園內車輛）",
        default_reject: "照片不清晰或不符規格",
        alt_reject_ok: "❌ 已退回該筆申請。",
        alt_approve_ok: "✅ 已核准！發配車牌【{id}】，並已發放 $50 獎勵金給 {student}！",
        alt_fix_ok: "✅ 車輛 {id} 已修復重新上架！",
        photo_title: "車輛照片",

        // ---------- 資訊頁 ----------
        info_go_apply: "前往申請回收",
        info_go_map: "前往地圖找車",
        info_donate_body: `
            <p>把校園裡被遺忘的腳踏車變成新的小綠綠！符合以下規範的車輛，經技師改裝並上架後，申請人可獲得 <strong>$50 儲值金</strong>。</p>
            <h4>✅ 接受的車輛</h4>
            <ul><li>校園內無主、或車主自願捐贈的一般自行車（非電動）</li><li>車架無斷裂，輪框無嚴重變形</li><li>煞車、鏈條、輪胎等零件可修復</li></ul>
            <h4>🚫 不接受的車輛</h4>
            <ul><li>電動自行車、兒童車</li><li>車架嚴重鏽蝕或斷裂</li><li>來源不明、疑似失竊的車輛</li></ul>
            <h4>📋 申請流程</h4>
            <ol><li>登入後至「會員專區」上傳 3 張車輛照片</li><li>AI 自動檢測車況與損耗率，未達合格門檻的車輛無法送出；通過後由技師線上審核</li><li>審核通過後，將車輛牽至校內修理站改裝並安裝 GPS 電子鎖</li><li>上架後系統自動發放 $50 儲值金</li></ol>
            <p class="muted">捐贈後車輛將統一漆成綠色，並由本計畫管理維護。</p>`,
        info_guide_body: `
            <ol class="info-steps">
              <li><strong>註冊 / 登入</strong>：使用學號建立帳號，密碼至少 6 個字元。</li>
              <li><strong>儲值</strong>：到「會員專區」用 LINE Pay（模擬）儲值，或輸入序號兌換儲值金。</li>
              <li><strong>找車</strong>：開啟「地圖尋車」，綠色圖示就是可租借的車輛，點擊即可租借。</li>
              <li><strong>解鎖</strong>：輸入車機螢幕上每分鐘更新一次的 4 位數密碼，系統扣款 $5 後解鎖。</li>
              <li><strong>騎乘</strong>：畫面下方會顯示騎乘時間與即時減碳量，重新整理也不會中斷。</li>
              <li><strong>還車</strong>：停在校園內安全、不妨礙通行的地方，按下「結束騎乘」，系統以 GPS 登記車輛位置。</li>
              <li><strong>報修</strong>：遇到故障請到「車輛報修」通報，車輛會立即下架，等技師修好再上架。</li>
            </ol>`,
        faq: [
            ["費用怎麼計算？", "每次解鎖扣除帳戶餘額 $5，騎乘時間不限。"],
            ["要怎麼儲值？", "到「會員專區」點「LINE Pay 儲值」（展示用模擬付款），或用「序號兌換」輸入活動序號。"],
            ["電子密碼在哪裡看？", "實體車機螢幕上會顯示每分鐘更新一次的 4 位數密碼。展示版會在解鎖視窗中顯示模擬車機螢幕。"],
            ["車子可以停在哪裡？", "校園內任何安全、不妨礙通行的地方都可以。若還車時不在校園範圍內，車輛會登記在地圖目前顯示的位置。"],
            ["騎到一半關掉網頁怎麼辦？", "騎乘狀態存在雲端，重新開啟網頁並登入後，計時會繼續，再按「結束騎乘」還車即可。"],
            ["車子壞了怎麼辦？", "請到「車輛報修」選擇車牌並描述狀況，車輛會立即從地圖下架，技師修好後會重新上架。"],
            ["減碳量怎麼算？", "以平均時速 15 公里、每公里減少 250 克碳排放估算，約每騎 1 秒減少 1 克。"],
            ["回收廢棄車有什麼獎勵？", "上傳照片並通過技師審核、車輛上架後，系統會自動發放 $50 儲值金。"]
        ],
        info_contact_body: `
            <p>📍 服務地點：國立中央大學 校內腳踏車修理站（桃園市中壢區中大路 300 號）</p>
            <p>🤖 也可以點畫面角落的 AI 客服泡泡，隨時詢問使用問題。</p>
            <p class="muted">或留下您的意見，修理站技師會在後台看到：</p>`,
        fb_name: "姓名", fb_contact: "聯絡方式（Email 或電話，選填）", fb_msg: "想告訴我們的事",
        fb_send: "送出意見", fb_ok: "✅ 已收到您的意見，謝謝！",
        info_terms_body: `
            <ol>
              <li>本系統為國立中央大學學生專案展示，並非學校官方正式營運系統。</li>
              <li>使用者應以本人學號註冊，並妥善保管密碼。</li>
              <li>每次解鎖收費 $5，自帳戶餘額扣除；儲值功能為模擬付款，不會產生實際金流。</li>
              <li>騎乘時請遵守交通規則並注意安全，還車時請停放於不妨礙通行之處。</li>
              <li>發現車輛損壞請立即透過「車輛報修」通報，惡意破壞者將停權處理。</li>
              <li>本計畫保留調整費率與服務內容之權利。</li>
            </ol>`,
        info_privacy_body: `
            <p>我們重視您的隱私，本系統僅蒐集提供服務所必需的資料：</p>
            <ul>
              <li><strong>帳號資料</strong>：學號；密碼由 Firebase Authentication 加密保存，我們無法得知您的密碼。</li>
              <li><strong>使用紀錄</strong>：帳戶餘額、騎乘時間、還車位置與減碳量。</li>
              <li><strong>上傳內容</strong>：回收申請的車輛照片與您留下的意見。</li>
            </ul>
            <p>以上資料僅用於本專案的租借、維修與統計功能，不會提供給第三方。排行榜中的學號會部分遮蔽。</p>`
    },

    en: {
        // ---------- Common ----------
        brand: "NCU Green Love Bikes",
        ok: "OK", cancel_btn: "Cancel", close: "Close", submit: "Submit", dlg_confirm: "Please confirm", loading: "Loading…",
        back: "❮ Back",
        err_generic: "Something went wrong: {msg}",
        err_network: "Network error, please try again later",
        err_db: "Unable to reach the database. Please check your connection!",
        need_login: "Please log in to use this feature!",

        // ---------- Navigation ----------
        nav_donate: "Donation Rules", nav_guide: "User Guide", nav_contact: "Contact Us", nav_faq: "FAQ",
        menu_home: "Home", menu_title: "NCU Green Love Bikes", menu_map: "Find a Bike", menu_member: "Member Area", menu_repair: "Report Repair", menu_carbon: "Carbon Saved",
        btn_login_nav: "Login", btn_logout_nav: "Logout", btn_switch_nav: "Switch Account", logout: "Logout",
        admin_name: "👨‍🔧 Technician",
        theme_toggle: "Toggle dark mode",

        // ---------- Hero ----------
        hero_tag: "🌱 Reviving the NCU Green Bike",
        hero_title: "Ride back to a<br>greener campus",
        hero_desc: "Dockless rental, return anywhere, just $5 per ride. Log in, open the map and find the nearest green bike.",
        hero_cta_map: "🚲 Find a bike",
        hero_cta_story: "About the project",
        stat_available: "Available now",
        stat_fee: "Per ride",
        stat_carbon_rate: "CO₂ saved / km",

        // ---------- Guide ----------
        guide_title: "How to Use Green Bikes",
        guide_step1: "Register / Login", guide_desc1: "Log in with your<br>student ID",
        guide_step2: "Unlock / Rent", guide_desc2: "Find a bike on map<br>and enter PIN",
        guide_step3: "Enjoy Riding", guide_desc3: "Enjoy the low-carbon<br>campus ride",
        guide_step4: "Return Anywhere", guide_desc4: "Park in a safe area<br>and end your ride",

        // ---------- Story ----------
        story_title: "Make Campus 'Green' Again: Reliving the NCU Green Bike Memories",
        img_caption1: "The vibrant green bikes cruising through the pine trees.",
        story_p1: "If you strolled through NCU around 2010, you surely noticed that flash of green among the pine trees — the 'NCU Green Bike'.",
        story_sub1: "What is 'NCU Green Bike'?",
        story_p2: "The 'NCU Green Bike' was a campus bike-sharing project launched around 2010. In an era before YouBike was popular, the university purchased a fleet of emerald-green bicycles to promote a low-carbon campus and reduce scooter traffic. Students and staff could ride freely between classrooms, dorms and dining halls — the bikes became a shared campus icon.",
        story_sub2: "Our Goal: Reviving the Green Legend",
        story_p3: "Over time, wear and tear, limited maintenance budgets and management challenges made the green bikes slowly disappear, until they became history.",
        story_p4: "Although the original bikes are gone, the vision of a sustainable, shared campus should not be forgotten. In 2026, facing climate change and the low-carbon transition, we are determined to revive the NCU Green Bike project.",
        story_p5: "We don't just want to bring the bikes back — we want to combine them with modern digital management and community power:",
        goal_1: "<strong>Better Management:</strong> Smart locks and app tracking to prevent loss and track maintenance.",
        goal_2: "<strong>Circular Economy:</strong> A repair community to pass on skills and reduce waste.",
        goal_3: "<strong>Low-Carbon Life:</strong> Making cycling the top choice for commuting on campus once again.",

        // ---------- Footer ----------
        footer_terms: "Terms of Service", footer_privacy: "Privacy Policy", footer_contact: "Contact Support",
        footer_copy: "© 2026 National Central University. All Rights Reserved.",
        footer_disclaimer: "*This website is a student project demo and not an official university system.",

        // ---------- Auth ----------
        login_sub: "NCU Green Love Bikes",
        id_label: "NCU email", pwd_label: "Password",
        login_school_note: "🎓 NCU Google email accounts (@g.ncu.edu.tw) only",
        reg_school_note: "We'll send a verification email to your NCU email (@g.ncu.edu.tw). Verify it to start using the service.",
        verify_title: "Verify your school email",
        verify_desc: "We sent a verification email to",
        verify_step1: "Open your NCU Google mailbox (Gmail) and find the email",
        verify_step2: "Click the verification link",
        verify_step3: "Come back and tap “I've verified”",
        verify_done_btn: "I've verified",
        verify_resend_btn: "Resend verification email",
        verify_spam: "Didn't get it? Check your spam folder, or resend later.",
        verify_other: "Use another account",
        verify_not_yet: "Not verified yet — please click the link in your NCU email first",
        verify_sent: "✅ Verification email sent again",
        verify_ok: "✅ School email verified. Welcome!",
        verify_wait: "Please wait {s}s before resending",
        err_old_account: "Only NCU email accounts (@g.ncu.edu.tw) can log in now. Old accounts are disabled — please register again with your NCU email.",
        forget_desc: "Enter your NCU email and we'll send a password reset email to it (@g.ncu.edu.tw).",
        forget_send: "Send reset email",
        forget_sent: "✅ Password reset email sent to {email}. Check your NCU mailbox.",
        id_ph: "Technician: admin", pwd_ph: "Technician pwd: admin123",
        login_btn: "Login", go_reg: "No account? Register", forget_pwd: "Forgot password",
        err_login: "Invalid ID/password or not registered",
        login_welcome: "Welcome back, {id}!",
        logged_out: "Logged out",
        reg_title: "📝 Create Account",
        reg_id_label: "NCU email", reg_pwd_label: "Set Password", reg_pwd2_label: "Confirm Password",
        reg_id_ph: "e.g. dkchan", reg_pwd_ph: "At least 6 characters", reg_pwd2_ph: "Enter the password again",
        reg_btn: "Create Account", back_login: "Have an account? Back to Login",
        alt_reg_ok: "✅ Registered! A verification email was sent to your NCU mailbox",
        err_id_format: "Enter the part before @ in your NCU email (letters, digits, . - _)",
        err_email_domain: "Only NCU Google email addresses (@g.ncu.edu.tw) are accepted",
        err_pwd_short: "Password must be at least 6 characters",
        err_pwd_mismatch: "Passwords do not match",
        err_id_taken: "This ID is already registered",
        err_too_many: "Too many attempts, please try again later",
        forget_title: "Forgot password",
        alt_forget: "Accounts use student IDs, so we can't send reset emails. Please bring your student card to the campus repair station, or contact the computer center / system admin to reset your password.",

        // ---------- Map / Rent ----------
        map_title: "Bicycle Rental Map",
        map_available: "{n} bikes available",
        map_locate: "📍 My location",
        err_geo: "Unable to get your location",
        unlock_title: "Unlock Bike",
        unlock_desc: "Dockless rental. Deducts <strong>$5</strong> per ride.",
        plate_label: "Plate Number",
        pwd_warn: "*Check the 4-digit code on the bike's screen",
        pwd_ph2: "Enter 4-digit code",
        screen_title: "Simulated bike screen (demo)",
        screen_refresh: "Refreshes in {s}s",
        unlock_btn: "Pay & Unlock",
        err_pin_format: "Please enter the 4-digit code",
        err_renting: "❌ You already have an active rental!",
        err_bal: "❌ Insufficient balance ($5 required)! Top up in Member Area.",
        err_pwd: "❌ Invalid code! Check the latest code on the bike's screen.",
        err_bike_unavailable: "This bike is not available — someone may have just rented it",
        alt_rent_ok: "✅ Paid $5 (balance ${bal}). Bike unlocked, timer started!",
        riding_title: "🚲 Riding: ",
        gps_monitor: "GPS Tracking Active",
        ride_carbon_live: "{g} g CO₂ saved",
        ride_pill: "Riding {id} · {time}",
        return_btn: "⏹️ End Ride & GPS Return",
        return_working: "Locating & returning…",
        ret_title: "✅ Ride complete",
        ret_duration: "Duration",
        ret_distance: "Est. distance",
        ret_carbon: "CO₂ saved",
        ret_fee: "Charged",
        ret_outside: "You're outside campus, so the bike was parked at the location shown on the map.",
        status_active: "Available", status_rented: "Rented", status_maintenance: "Maintenance",

        // ---------- Repair ----------
        repair_title: "Bicycle Repair",
        repair_warn: "⚠️ Reported bikes will be hidden from the map. Bring it to the station.",
        rep_id_label: "Bike Plate Number", rep_select_ph: "Select a bike",
        rep_desc_label: "Damage Description", rep_desc_ph: "e.g., Broken brakes, loose chain",
        repair_btn: "Report Broken Bike",
        err_empty: "Please fill in all fields!",
        err_bike_in_use: "This bike is currently rented and can't be reported",
        err_return_first: "Please end your ride before reporting this bike",
        err_already_maint: "This bike is already under maintenance",
        alt_rep_ok: "✅ Reported and taken offline! Bring bike to station.",
        rep_photo_label: "Damage photos (1–3)",
        rep_photo_hint: "Include a full view of the bike and close-ups of the damage, for repairs and AI review.",
        rep_photo_alt: "Repair photo {n}",
        err_rep_photo_none: "Please choose at least one photo of the damage!",
        err_rep_photo_many: "You can choose up to 3 photos!",
        err_rep_photo_type: "Please use JPG, PNG or WebP images!",
        err_rep_photo_size: "Each photo must be 5 MB or smaller!",

        // ---------- Reclaim / Upload ----------
        reclaim_title: "🚲 Reclaim Abandoned Bikes",
        reclaim_desc: "1. Bring bike to Repair Station.<br>2. Install GPS lock.<br>Earn <strong>$50 Bonus</strong>!",
        reclaim_btn: "Fill Reclaim Form",
        upload_title: "Upload Photos",
        upload_h3: "📸 Provide Bike Photos",
        upload_desc: "Follow the instructions in each box to photograph the whole bike and specific parts (7 required, 1 optional). The AI checks the bike's condition; once approved, bring it to the station.",
        part_whole_side: "Whole bike – side", part_whole_front: "Whole bike – front", part_frame: "Frame", part_wheels: "Wheels & tyres",
        part_brakes: "Brakes", part_chain: "Chain & chainring", part_cockpit: "Saddle & handlebar", part_extra: "Other damage", part_whole: "Whole bike",
        hint_whole_side: "Stand about 2 m to the side so the whole bike is in frame",
        hint_whole_front: "Shoot from straight in front; handlebar and front wheel clearly visible",
        hint_frame: "The frame triangle and welds; show any cracks or dents clearly",
        hint_wheels: "Close-up of tyre tread and rim; pick the worse wheel",
        hint_brakes: "Close-up of the brake caliper and pads",
        hint_chain: "Close-up of the chain and chainring, showing any rust",
        hint_cockpit: "Saddle surface, handlebar and brake levers",
        hint_extra: "Only if there's other visible damage",
        tag_required: "Required", tag_optional: "Optional",
        upload_count: "{n} / {total} required photos done",
        err_upload_parts: "❌ Still missing: {parts}",
        bike_tap_part: "Tap a part on the drawing to see its photo",
        bike_no_photos: "No photos for this bike yet",
        bike_no_part_photo: "No photo of this part yet",
        bike_photo_credit: "Photo",
        bike_condition: "Condition when listed: {score} · wear {wear}%",
        bike_login_to_rent: "Log in to unlock this bike",
        bike_loading_photos: "Loading photos…",
        pic1_label: "1. Front View", pic2_label: "2. Side View", pic3_label: "3. Close-up / Damage",
        pick_photo: "Tap to choose a photo",
        upload_submit: "Submit Photos & Application",
        upload_working: "Compressing & uploading…",
        err_upload: "❌ Please upload all 3 photos to submit!",
        err_img: "Can't read this image, please choose another",
        err_too_big: "Photos are too large, please use smaller ones",
        alt_upload_ok: "✅ Photos and application sent! Check the progress in the Member Area.",

        // ---------- AI condition check ----------
        ai_checking: "🤖 AI is checking the bike, about 10–30 seconds…",
        ai_unavailable: "The Claude AI check is unavailable right now; a technician will confirm the result.",
        hy_hard_fail: "Claude found a disqualifying problem (e.g. broken frame, e-bike, not a bicycle)",
        hy_local_notbike: "Our model thinks this isn't a recyclable bicycle, or the photos are unclear",
        hy_claude_review: "Claude couldn't fully judge this bike",
        hy_agree: "Our model and Claude agree",
        hy_disagree: "Our model and Claude disagree, so a technician will decide",
        hy_claude_only: "Our model wasn't confident enough, so Claude's judgement is used",
        hy_local_only: "Claude is unavailable, so only our model's judgement is used",
        hy_none: "Neither model could judge this bike, so a technician will decide",
        hy_local_title: "🧠 Our model",
        hy_claude_title: "🤖 Claude part-by-part analysis",
        hy_local_grade: "Predicted “{g}” with {p}% confidence",
        hy_local_score: "Our model score",
        hy_claude_score: "Claude score",
        grade_A: "A Good", grade_B: "B Minor wear", grade_C: "C Moderate wear", grade_D: "D Severe damage", grade_X: "X Not usable",
        ai_title: "🤖 AI Condition Check",
        ai_verdict_pass: "✅ Passed the pre-check",
        ai_verdict_fail: "❌ Does not meet the standard",
        ai_verdict_review: "⚠️ Needs technician review",
        ai_short_pass: "Pass", ai_short_fail: "Fail", ai_short_review: "Review",
        ai_score: "Condition score",
        ai_wear: "Wear rate",
        ai_threshold: "Pass mark: {n}",
        ai_hint_pass: "A technician will make the final decision after you submit.",
        ai_hint_review: "The AI couldn't fully judge this bike; a technician will review it after you submit.",
        ai_hint_fail: "This bike doesn't meet the reclaim standard. Try clearer photos, or apply with a different bike.",
        ai_submit: "Submit application",
        ai_retake: "Choose other photos",
        ai_none: "Not checked",
        ai_disclaimer: "AI results are for reference only; a technician makes the final decision.",
        th_ai: "AI check",
        cond_good: "Good", cond_minor_wear: "Minor wear", cond_moderate_wear: "Moderate wear", cond_severe: "Severe", cond_not_visible: "Not visible",

        // ---------- Member ----------
        member_title: "Member Area",
        member_hi: "Hi, {id} 👋",
        wallet_title: "Account Balance",
        linepay_btn: "💬 LINE Pay Top-up",
        promo_btn: "🎁 Redeem Code",
        pwd_change_btn: "🔒 Change Password",
        stat_rides: "Rides",
        stat_total_carbon: "Total CO₂ saved",
        topup_title: "💬 LINE Pay Top-up",
        topup_custom: "Or enter a custom amount",
        topup_next: "Continue to pay",
        prompt_linepay: "Choose or enter an amount to top up via LINE Pay",
        err_amount: "❌ Please enter a whole amount between 1 and 5000!",
        linepay_screen: "LINE Pay (simulated)",
        linepay_confirm: "Confirm payment of NT$ {n}?",
        linepay_pay: "Pay",
        alt_line_ok: "✅ LINE Pay successful! Added ${n}",
        alt_cancel: "❌ Transaction canceled.",
        promo_title: "🎁 Redeem Code",
        prompt_promo: "Enter promo code:",
        err_promo_used: "❌ You've already used this code!",
        err_promo_invalid: "❌ Invalid promo code!",
        alt_promo_ok: "🎉 Success! You received ${n} bonus!",
        pwd_title: "🔒 Change Password",
        pwd_old: "Current password", pwd_new: "New password", pwd_new2: "Confirm new password",
        pwd_changed: "✅ Password updated",
        err_old_pwd: "Current password is incorrect",
        rides_title: "🚲 Ride History",
        no_rides: "No rides yet — grab a bike from the map!",
        th_date: "Date", th_duration: "Duration", th_carbon: "CO₂", th_fee: "Fee",
        history_title: "📜 Reclaim Application History",
        history_time: "Time", history_status: "Status", history_reason: "Reason",
        no_history: "No records found",
        pending: "⏳ Pending", approved: "✅ Approved", rejected: "❌ Rejected",
        bonus_sent: "$50 credited, plate {id}",

        // ---------- Carbon ----------
        carbon_title: "Carbon Saved",
        carbon_h3: "🌍 Your Green Footprint",
        carbon_p: "Based on ECF standards, cycling saves about <strong>250 g</strong> of CO₂ per km compared to driving (estimated at an average 15 km/h).",
        carbon_today: "Today's Carbon Saved", carbon_total: "Total Carbon Saved", carbon_unit: "g", carbon_unit2: "g",
        carbon_rides: "Rides",
        carbon_km: "Est. kilometres",
        carbon_tree: "🌳 About what {n} trees absorb in a day",
        leader_title: "🏆 Campus Leaderboard",
        leader_me: " (you)",
        leader_empty: "No one on the board yet — ride to take first place!",

        // ---------- Admin ----------
        admin_title: "👨‍🔧 Bike Repair Station - Tech Admin",
        st_active: "Available", st_rented: "Rented", st_maint: "Maintenance", st_pending: "Pending apps", st_repairs: "Open repairs",
        admin_appr_title: "🚲 Pending Reclaim (Photos attached)",
        admin_rep_title: "🔧 Pending Repair List",
        admin_fleet_title: "🗺️ Fleet Overview",
        admin_fb_title: "💬 User Feedback",
        th_student: "Student", th_time: "Time", th_action: "Action", th_photos: "Photos",
        th_bike: "Bike ID", th_desc: "Description", th_reporter: "Reporter",
        th_status: "Status", th_location: "Location", th_rider: "Rider",
        th_name: "Name", th_contact: "Contact", th_msg: "Message",
        empty_rep: "No pending repairs", empty_appr: "No pending applications", no_feedback: "No feedback yet",
        appr_photo_msg: "Click a photo to enlarge",
        btn_approve: "Approve", btn_reject: "Reject", btn_fix: "Fixed & Online",
        btn_offline: "Take offline", btn_online: "Put online",
        reject_title: "Reject application",
        prompt_reject: "Enter the reason for rejection (e.g., unclear photos, not a campus bike)",
        default_reject: "Unclear photos or does not meet standards",
        alt_reject_ok: "❌ Application rejected.",
        alt_approve_ok: "✅ Approved! Plate [{id}] issued and $50 credited to {student}!",
        alt_fix_ok: "✅ Bike {id} fixed and back online!",
        photo_title: "Bike photo",

        // ---------- Info pages ----------
        info_go_apply: "Apply to reclaim a bike",
        info_go_map: "Find a bike on the map",
        info_donate_body: `
            <p>Turn forgotten campus bikes into new green bikes! Bikes that meet these rules are refurbished by our technicians, and the applicant receives a <strong>$50 credit</strong> once the bike goes online.</p>
            <h4>✅ Accepted</h4>
            <ul><li>Unclaimed campus bikes, or regular bikes donated by their owners (non-electric)</li><li>Frame intact, wheels not badly bent</li><li>Brakes, chain and tyres can be repaired</li></ul>
            <h4>🚫 Not accepted</h4>
            <ul><li>E-bikes and children's bikes</li><li>Badly rusted or broken frames</li><li>Bikes of unknown origin or suspected stolen</li></ul>
            <h4>📋 Process</h4>
            <ol><li>Log in and upload 3 photos in the Member Area</li><li>AI checks the bike's condition and wear rate — bikes below the pass mark can't be submitted; the rest are reviewed by a technician</li><li>Once approved, bring the bike to the campus repair station to be refitted with a GPS lock</li><li>When it goes online, $50 is credited automatically</li></ol>
            <p class="muted">Donated bikes are painted green and maintained by the project.</p>`,
        info_guide_body: `
            <ol class="info-steps">
              <li><strong>Register / Login</strong>: create an account with your student ID (password at least 6 characters).</li>
              <li><strong>Top up</strong>: use LINE Pay (simulated) or a promo code in the Member Area.</li>
              <li><strong>Find a bike</strong>: open "Find a Bike" — green pins are available bikes. Tap one to rent it.</li>
              <li><strong>Unlock</strong>: enter the 4-digit code shown on the bike's screen (refreshes every minute). $5 is charged and the bike unlocks.</li>
              <li><strong>Ride</strong>: your ride time and live CO₂ savings appear at the bottom. Refreshing the page won't stop the ride.</li>
              <li><strong>Return</strong>: park safely on campus and tap "End Ride". GPS records where the bike is.</li>
              <li><strong>Report</strong>: report broken bikes in "Report Repair". They go offline until a technician fixes them.</li>
            </ol>`,
        faq: [
            ["How much does it cost?", "Each unlock deducts $5 from your balance, with no time limit."],
            ["How do I top up?", "In the Member Area, tap \"LINE Pay Top-up\" (simulated payment for the demo) or redeem a promo code."],
            ["Where is the unlock code?", "The bike's screen shows a 4-digit code that refreshes every minute. In this demo, a simulated screen appears in the unlock window."],
            ["Where can I park?", "Anywhere safe on campus that doesn't block the way. If you return outside campus, the bike is parked at the location shown on the map."],
            ["What if I close the page mid-ride?", "Your ride is stored in the cloud. Log in again and the timer continues — just tap \"End Ride\" to return."],
            ["What if a bike is broken?", "Go to \"Report Repair\", choose the plate and describe the problem. The bike goes offline immediately until it's fixed."],
            ["How is CO₂ calculated?", "We assume an average 15 km/h and 250 g of CO₂ saved per km — about 1 g per second of riding."],
            ["What do I get for reclaiming a bike?", "Once your photos are approved and the bike goes online, $50 is credited to your account."]
        ],
        info_contact_body: `
            <p>📍 Location: Bike repair station, National Central University (No. 300, Zhongda Rd., Zhongli, Taoyuan)</p>
            <p>🤖 You can also tap the AI assistant bubble in the corner for help anytime.</p>
            <p class="muted">Or leave a message — technicians will see it in the admin panel:</p>`,
        fb_name: "Name", fb_contact: "Contact (email or phone, optional)", fb_msg: "Your message",
        fb_send: "Send", fb_ok: "✅ Thanks for your feedback!",
        info_terms_body: `
            <ol>
              <li>This system is a student project demo of National Central University, not an official university service.</li>
              <li>Register with your own student ID and keep your password safe.</li>
              <li>Each unlock costs $5, deducted from your balance. Top-ups are simulated and no real payment occurs.</li>
              <li>Follow traffic rules while riding, and park where you won't block the way.</li>
              <li>Report damaged bikes via "Report Repair". Accounts involved in vandalism will be suspended.</li>
              <li>The project may adjust fees and services.</li>
            </ol>`,
        info_privacy_body: `
            <p>We only collect the data needed to run the service:</p>
            <ul>
              <li><strong>Account</strong>: your student ID. Passwords are stored encrypted by Firebase Authentication — we can't see them.</li>
              <li><strong>Usage</strong>: balance, ride times, return locations and CO₂ savings.</li>
              <li><strong>Uploads</strong>: bike photos for reclaim applications and feedback you send.</li>
            </ul>
            <p>This data is only used for rentals, repairs and statistics in this project and is never shared with third parties. Student IDs on the leaderboard are partially masked.</p>`
    }
};
