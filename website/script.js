
        // ==========================================
        // 💡 雙語字典與切換邏輯 (i18n System)
        // ==========================================
        const translations = {
            zh: {
                  story_title: "讓校園再次「綠」起來：重拾中央小綠綠的單車回憶",
                 img_caption1: "回憶中穿梭在松林間的翠綠身影",
                 story_p1: "如果你是在 2010 年左右漫步在中央大學的校園，你一定會注意到那一抹穿梭在松林間的鮮豔色彩——「中央小綠綠」。",
                 story_sub1: "什麼是「中央小綠綠」？",
                 story_p2: "「中央小綠綠」是中央大學於 2010 年前後發起的校園綠色腳踏車計畫。在那個 YouBike 尚未普及的年代，學校為了推廣低碳校園、減輕校內機車負擔，特別購置了一批翠綠色的單車。這些腳踏車採取「公共共享」的概念，讓學生與教職員能自由騎乘於教學區、宿舍與餐廳之間，是許多中大人心中共同的校園標誌。",
                 story_p3: "然而，隨著時間推移，車輛損耗、維護經費不足以及管理機制等挑戰，讓這群綠色身影逐漸消失在校園的角落，最終走入了歷史。",
                 story_sub2: "我們的目標：復活綠色傳奇",
                 story_p4: "雖然「小綠綠」退場了，但當初那份永續校園與共享便捷的初心不應被遺忘。在 2026 年的今天，面對氣候變遷與減碳轉型的浪潮，我們立志要「復活中央小綠綠計畫」。",
                  goal_1: "<strong>優化管理：</strong> 引入智慧門鎖與 App 追蹤，解決當年車輛遺失與維修不明的問題。",
                  story_p5:"我們不只是想帶回那輛腳踏車，更是要結合現代的數位管理與社群力量：",
                  goal_2: "<strong>循環經濟：</strong> 建立校內維修社群，讓修車成為一種技能傳承，減少資源浪費。",
                   goal_3: "<strong>低碳生活：</strong> 讓腳踏車再次成為中大人校內通勤的首選，找回慢活的松林美景。",
                login_sub: "中大愛心綠色腳踏車", id_label: "學號 / 帳號", pwd_label: "密碼", id_ph: "技師請輸入 admin", pwd_ph: "技師密碼 admin123", login_btn: "登入系統", go_reg: "還沒有帳號？ 前往註冊", forget_pwd: "忘記密碼",
                reg_title: "📝 新增學生帳號", reg_id_label: "設定學號", reg_pwd_label: "設定密碼", reg_btn: "立即開通帳號", back_login: "返回登入",
                logout: "登出", menu_title: "中大愛心綠色腳踏車", menu_map: "地圖尋車", menu_member: "會員專區", menu_repair: "車輛報修", menu_carbon: "減碳貢獻",
                back: "❮ 返回", carbon_title: "減碳貢獻", carbon_h3: "🌍 您的綠色足跡", carbon_p: "依據歐洲自行車聯盟的研究基準，以自行車取代燃油車，平均每騎乘 1 公里可減少約 <strong>250 克</strong> 的碳排放。", carbon_today: "本日節碳量", carbon_total: "累積總節碳量", carbon_unit: "克", carbon_unit2: "克",
                member_title: "會員專區", wallet_title: "會員帳戶餘額", linepay_btn: "💬 LINE Pay 儲值", promo_btn: "🎁 序號兌換", reclaim_title: "🚲 回收校園廢棄車輛", reclaim_desc: "1. 牽至【校內修理站】進行規格改裝。<br>2. 註冊系統並安裝 GPS 電子鎖。<br>技師上架後，系統自動回饋 <strong>$50 帳戶儲值金</strong>！", reclaim_btn: "前往填寫回收申請單",
                upload_title: "車輛照片上傳", upload_h3: "📸 提供車輛檢測照片", upload_desc: "為確保車輛符合改裝標準，請上傳 3 張清晰的車輛照片。審核通過後，方可牽至修理站。", pic1_label: "1. 車輛正面照", pic2_label: "2. 車輛側面照", pic3_label: "3. 局部特寫 / 損壞處", upload_submit: "確認上傳並送出申請", err_upload: "❌ 請務必上傳滿 3 張車輛照片才能送出申請！", alt_upload_ok: "✅ 照片與申請已送出！請隨時至會員專區查看審核進度。",
                repair_title: "車輛報修", repair_warn: "⚠️ 報修後車輛將立刻從地圖隱藏，請牽至修理站維修。", rep_id_label: "故障車牌號碼", rep_id_ph: "例如: NCU-001", rep_desc_label: "損壞狀況描述", rep_desc_ph: "例如: 煞車失靈", repair_btn: "通報損壞腳踏車",
                admin_title: "👨‍🔧 腳踏車修理站 - 技師管理後台", admin_appr_title: "🚲 待改裝與註冊車輛 (已附照片)", th_student: "申請學生", th_time: "申請時間", th_action: "操作", admin_rep_title: "🔧 待修復車輛清單", th_bike: "報修車號", th_desc: "損壞描述",
                map_title: "地圖尋車", unlock_title: "解鎖車輛", unlock_desc: "無固定站點借還，單次騎乘將扣除帳戶餘額 <strong style='color:#0072C6;'>$5</strong>", plate_label: "車牌號碼", pwd_warn: "*請查看實體腳踏車電子螢幕上的 4 位數密碼", pwd_ph2: "輸入電子密碼", unlock_btn: "帳戶餘額付款並解鎖", cancel_btn: "取消", riding_title: "🚲 騎乘中：", gps_monitor: "GPS 追蹤監控運行中", return_btn: "⏹️ 結束騎乘並 GPS 還車",
                // JS Alerts / Dynamic Data
                alt_forget: "請聯繫計中或系統管理員重置密碼", alt_reg_ok: "✅ 註冊成功！請登入系統。", prompt_linepay: "請輸入想透過 LINE Pay 儲值的金額 (例如: 50, 100)：", err_amount: "❌ 請輸入有效的金額！", alt_line_wait: "🔄 正在轉跳至 LINE Pay 授權頁面...\n(請等候 1.5 秒)", cfm_linepay_1: "【LINE Pay 模擬畫面】\n是否確認支付 台幣 ", cfm_linepay_2: " 元？", alt_line_ok: "✅ LINE Pay 交易成功！", alt_cancel: "❌ 交易已取消。", prompt_promo: "請輸入您的點數儲值序號：", err_promo_used: "❌ 兌換失敗：此序號已被使用過了！", alt_promo_ok: "🎉 兌換成功！獲得 ", alt_promo_ok2: " 元儲值金！", err_promo_invalid: "❌ 兌換失敗：無效的序號！", err_empty: "請填寫完整資訊！", alt_rep_ok: "✅ 已通報並下線該車輛！請牽至修理站。", alt_fix_ok: "✅ 車輛 ", alt_fix_ok2: " 已修復重新上架！", err_renting: "❌ 您已經有一台租借中的車輛！", err_bal: "❌ 帳戶餘額不足 (單次騎乘需 5 元)！請先至會員專區儲值。", err_pwd: "❌ 電子密碼驗證失敗！請確認實體車機螢幕上的最新密碼。", alt_rent_ok: "✅ 付款成功！已扣款 5 元 (餘額 ", alt_rent_ok2: " 元)。\n車輛解鎖，開始計時！", alt_ret_ok: "✅ 還車成功！\n騎乘時間：", alt_ret_ok2: "\n🌱 本次為地球減少了 ", alt_ret_ok3: " 克的碳排放！", empty_rep: "無待修車輛", empty_appr: "無待安裝車輛", btn_fix: "修復上架", err_login: "帳密錯誤或尚未註冊", 
                history_title: "📜 廢棄車回收申請紀錄", history_time: "時間", history_status: "狀態", history_reason: "備註 / 原因", no_history: "尚無申請紀錄", pending: "⏳ 審核中", approved: "✅ 已通過", rejected: "❌ 未通過", bonus_sent: "已發放 $50", 
                appr_photo_msg: "(已審核3張照片)", btn_approve: "通過核准", btn_reject: "退回", prompt_reject: "請輸入退回/未通過原因：\n(例如：照片不清晰、非校園內車輛)", default_reject: "照片不清晰或不符規格", alt_reject_ok: "❌ 已退回該筆申請。", alt_approve_ok1: "✅ 已核准！發配車牌【", alt_approve_ok2: "】。\n已標記為審核通過並發放獎勵金！",
                btn_login_nav: "登入",
                btn_logout_nav: "登出系統",
                btn_switch_nav: "切換帳號"
            },
            en: {
                story_title: "Make Campus 'Green' Again: Reliving the NCU Green Bike Memories",
        img_caption1: "The vibrant green bikes cruising through the pine trees.",
        story_p1: "If you strolled through NCU around 2010, you surely noticed that flash of green color among the pine trees—the 'NCU Green Bike'.",
        story_sub1: "What is 'NCU Green Bike'?",
        story_p2: "The 'NCU Green Bike' was a campus bike-sharing project launched around 2010. In an era before YouBike was popular, the university purchased a fleet of emerald-green bicycles to promote a low-carbon campus.",
        story_p3:"However, as time went by, challenges such as vehicle wear and tear, insufficient maintenance funds, and management mechanisms caused these green figures to gradually disappear from the corners of the campus and eventually become history",
        story_sub2: "Our Goal: Reviving the Green Legend",
        story_p4: "Though the original project ended, the vision of campus sustainability should not be forgotten. In 2026, we aim to revive the NCU Green Bike project.",
        goal_1: "<strong>Better Management:</strong> Smart locks and App tracking to prevent loss and track maintenance.",
        story_p5:"We want to do more than just bring back that modern bicycle; we want to combine digital management with the power of the community.",
        goal_2: "<strong>Circular Economy:</strong> A repair community to pass on skills and reduce waste.",
        goal_3: "<strong>Low-Carbon Life:</strong> Making cycling the top choice for commuting on campus once again.",
                login_sub: "NCU Green Love Bikes", id_label: "Student ID / Account", pwd_label: "Password", id_ph: "Tech enter admin", pwd_ph: "Tech pwd admin123", login_btn: "Login", go_reg: "No account? Registration", forget_pwd: "Forget password",
                reg_title: "📝 Create Account", reg_id_label: "Student ID", reg_pwd_label: "Set Password", reg_btn: "Registration", back_login: "Back to Login",
                logout: "Logout", menu_title: "NCU Green Love Bikes", menu_map: "Find a Bike", menu_member: "Member Area", menu_repair: "Report Repair", menu_carbon: "Reduce Carbon",
                back: "❮ Back", carbon_title: "Reduce Carbon", carbon_h3: "🌍 Your Green Footprint", carbon_p: "Based on ECF standards, cycling saves <strong>250g</strong> of CO2 per km compared to driving.", carbon_today: "Today's Carbon Saved", carbon_total: "Total Carbon Saved", carbon_unit: "g", carbon_unit2: "g",
                member_title: "Members Area", wallet_title: "Account Balance", linepay_btn: "💬 LINE Pay Top-up", promo_btn: "🎁 Redeem Code", reclaim_title: "🚲 Reclaim Abandoned Bikes", reclaim_desc: "1. Bring bike to Repair Station.<br>2. Install GPS lock.<br>Earn <strong>$50 Bonus</strong>!", reclaim_btn: "Fill Reclaim Form",
                upload_title: "Upload Photos", upload_h3: "📸 Provide Bike Photos", upload_desc: "To ensure the bike meets modification standards, please upload 3 clear photos. Once approved, bring it to the station.", pic1_label: "1. Front View", pic2_label: "2. Side View", pic3_label: "3. Close-up / Damage", upload_submit: "Submit Photos & Application", err_upload: "❌ Please upload all 3 photos to submit!", alt_upload_ok: "✅ Photos and application sent! Please check the progress in the Member Area.",
                repair_title: "Bicycle Repair", repair_warn: "⚠️ Reported bikes will be hidden from the map. Bring it to the station.", rep_id_label: "Bike Plate Number", rep_id_ph: "e.g., NCU-001", rep_desc_label: "Damage Description", rep_desc_ph: "e.g., Broken brakes", repair_btn: "Report Broken Bike",
                admin_title: "👨‍🔧 Bike Repair Station - Tech Admin", admin_appr_title: "🚲 Pending Reclaim (Photos attached)", th_student: "Student", th_time: "Time", th_action: "Action", admin_rep_title: "🔧 Pending Repair List", th_bike: "Bike ID", th_desc: "Description",
                map_title: "Bicycle Rental Map", unlock_title: "Unlock Bike", unlock_desc: "Dockless rental. Deducts <strong style='color:#0072C6;'>$5</strong> per ride.", plate_label: "Plate Number", pwd_warn: "*Check the 4-digit code on the bike's screen", pwd_ph2: "Enter code", unlock_btn: "Pay & Unlock", cancel_btn: "Cancel", riding_title: "🚲 Riding: ", gps_monitor: "GPS Tracking Active", return_btn: "⏹️ End Ride & GPS Return",
                // JS Alerts / Dynamic Data
                alt_forget: "Please contact the admin to reset your password.", alt_reg_ok: "✅ Registration successful! Please login.", prompt_linepay: "Enter LINE Pay top-up amount (e.g., 50, 100):", err_amount: "❌ Invalid amount!", alt_line_wait: "🔄 Redirecting to LINE Pay...\n(Please wait 1.5s)", cfm_linepay_1: "[LINE Pay Simulation]\nConfirm payment of NT$ ", cfm_linepay_2: " ?", alt_line_ok: "✅ LINE Pay successful!", alt_cancel: "❌ Transaction canceled.", prompt_promo: "Enter promo code:", err_promo_used: "❌ Promo code already used!", alt_promo_ok: "🎉 Success! You received $", alt_promo_ok2: " bonus!", err_promo_invalid: "❌ Invalid promo code!", err_empty: "Please fill in all fields!", alt_rep_ok: "✅ Reported and taken offline! Bring bike to station.", alt_fix_ok: "✅ Bike ", alt_fix_ok2: " fixed and online!", err_renting: "❌ You already have an active rental!", err_bal: "❌ Insufficient balance ($5 required)! Top up in Member Area.", err_pwd: "❌ Invalid password! Check the physical bike screen.", alt_rent_ok: "✅ Payment success! Deducted $5 (Balance $", alt_rent_ok2: ").\nBike unlocked, timer started!", alt_ret_ok: "✅ Return successful!\nDuration: ", alt_ret_ok2: "\n🌱 You saved ", alt_ret_ok3: " g of carbon emissions!", empty_rep: "No pending repairs", empty_appr: "No pending applications", btn_fix: "Fixed & Online", err_login: "Invalid ID/Password or Unregistered",
                history_title: "📜 Reclaim Application History", history_time: "Time", history_status: "Status", history_reason: "Reason", no_history: "No records found", pending: "⏳ Pending", approved: "✅ Approved", rejected: "❌ Rejected", bonus_sent: "$50 Credited",
                appr_photo_msg: "(3 Photos Checked)", btn_approve: "Approve", btn_reject: "Reject", prompt_reject: "Enter reason for rejection:\n(e.g., Unclear photos, not a campus bike)", default_reject: "Unclear photos or does not meet standards", alt_reject_ok: "❌ Application rejected.", alt_approve_ok1: "✅ Approved! Plate issued [", alt_approve_ok2: "].\nBonus credited to user account!",
                btn_login_nav: "Login",
                btn_logout_nav: "Logout",
                btn_switch_nav: "Switch Account"        
            }
        };

        let currentLang = 'zh';
        function t(key) { return translations[currentLang][key] || key; }

        function changeLang(lang) {
            currentLang = lang;
            document.querySelectorAll('[data-i18n]').forEach(el => {
                if (translations[lang][el.getAttribute('data-i18n')]) el.innerHTML = translations[lang][el.getAttribute('data-i18n')];
            });
            document.querySelectorAll('[data-i18n-ph]').forEach(el => {
                if (translations[lang][el.getAttribute('data-i18n-ph')]) el.placeholder = translations[lang][el.getAttribute('data-i18n-ph')];
            });
            if (document.getElementById('memberSection').classList.contains('active-view')) renderMemberCenter();
            if (document.getElementById('adminSection').classList.contains('active-view')) renderAdminDashboard();
            renderUserMenu(); 
}
        

        // ==========================================
        // 核心邏輯
        // ==========================================
        let serverBikeDatabase = {
            "NCU-001": { lat: 24.96815, lng: 121.19242, pwd: "0000", status: "active" },
            "NCU-002": { lat: 24.96750, lng: 121.19450, pwd: "0000", status: "active" }
        };
        let repairQueue = [], applicationHistory = [], currentUser = ""; 
        let validPromoCodes = { "SDGS-2024": { amount: 50, used: false }, "PROFESSOR-100": { amount: 100, used: false } };

        // 1分鐘自動刷新密碼
        setInterval(() => {
            console.log("🔄 車輛動態密碼已刷新：");
            for (let bikeId in serverBikeDatabase) { 
                let newPwd = Math.floor(1000 + Math.random() * 9000).toString();
                serverBikeDatabase[bikeId].pwd = newPwd; 
                console.log(`[${bikeId}] 實體車機螢幕顯示密碼: ${newPwd}`);
            }
        }, 60000); 
        // 檢查登入權限的通用函式
        function checkAuth(callback) {
            if (!currentUser) {
          alert("請先登入系統才能使用此功能！");
          switchView('loginSection');
          return false;
         }
         if (callback) callback(); // 如果已登入，執行原本的功能
        return true;
        }
        function switchView(targetId) {
            document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active-view'));
            document.getElementById(targetId).classList.add('active-view');
        }

        function logout() {
            currentUser = ""; document.getElementById('loginId').value = ""; document.getElementById('loginPwd').value = "";
            switchView('loginSection');
            renderUserMenu(); //
        }
        function renderUserMenu() {
             const menuContainer = document.getElementById('userMenu');
             // 如果 HTML 還沒加 id="userMenu" 的容器，先跳出避免報錯
             if (!menuContainer) return; 

             if (!currentUser) {
        // 未登入狀態：顯示登入按鈕
        menuContainer.innerHTML = `
            <button class="user-btn" onclick="switchView('loginSection')">${t('btn_login_nav')}</button>
        `;
         } else {
        // 已登入狀態：顯示帳號下拉選單
        const displayName = currentUser === 'admin' ? '👨‍🔧 技師' : `👤 ${currentUser}`;
        menuContainer.innerHTML = `
            <div class="dropdown" id="userDropdown">
                <button class="user-btn" onclick="toggleUserDropdown(event)">
                    ${displayName} ▾
                </button>
                <div class="dropdown-content">
                    <div onclick="logout()">${t('btn_logout_nav')}</div>
                    <div onclick="switchAccount()">${t('btn_switch_nav')}</div>
                </div>
            </div>
                 `;
             }
        }

// 切換下拉選單顯示/隱藏
        function toggleUserDropdown(event) {
         event.stopPropagation(); // 防止點擊事件冒泡到 window
         document.getElementById('userDropdown').classList.toggle('show-dropdown');
        }

// 切換帳號邏輯
        function switchAccount() {
         currentUser = ""; 
          document.getElementById('loginId').value = "";
         document.getElementById('loginPwd').value = "";
          switchView('loginSection');
          renderUserMenu();
        }

// 點擊網頁其他地方時關閉選單
        window.addEventListener('click', function() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.classList.remove('show-dropdown');
        });

        function handleRegister(event) {
            event.preventDefault();
            localStorage.setItem('savedStudentId', document.getElementById('regId').value);
            localStorage.setItem('savedPassword', document.getElementById('regPwd').value);
            if (!localStorage.getItem('accountBalance')) localStorage.setItem('accountBalance', '0'); 
            alert(t('alt_reg_ok')); switchView('loginSection');
        }

        function handleLogin(event) {
            event.preventDefault();
            const id = document.getElementById('loginId').value;
            const pwd = document.getElementById('loginPwd').value;

            if (id === 'admin' && pwd === 'admin123') {
                currentUser = "admin"; renderAdminDashboard(); switchView('adminSection'); renderUserMenu(); //
                return;
            }

            if (id === localStorage.getItem('savedStudentId') && pwd === localStorage.getItem('savedPassword')) {
                currentUser = id; document.getElementById('loginError').style.display = 'none'; switchView('mainMenuSection');
                renderUserMenu();
            } else { 
                document.getElementById('loginError').innerText = t('err_login');
                document.getElementById('loginError').style.display = 'block'; 
            }
        }

        function enterMemberPage() {checkAuth(() => { renderMemberCenter(); switchView('memberSection');}); }

        function renderMemberCenter() {
            let balance = localStorage.getItem('accountBalance') || '0';
            
            let historyHtml = `
                <div style="margin-top: 25px; width: 100%; text-align: left;">
                    <h4 style="margin: 0 0 10px 0; color: #333; border-bottom: 2px solid #eee; padding-bottom: 5px;">${t('history_title')}</h4>
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
                        <thead><tr style="background-color: #f4f4f9;"><th style="padding: 8px; border-bottom: 1px solid #ddd;">${t('history_time')}</th><th style="padding: 8px; border-bottom: 1px solid #ddd;">${t('history_status')}</th><th style="padding: 8px; border-bottom: 1px solid #ddd;">${t('history_reason')}</th></tr></thead>
                        <tbody>
            `;
            
            let myApps = applicationHistory.filter(app => app.studentId === currentUser);
            if (myApps.length === 0) {
                historyHtml += `<tr><td colspan="3" style="text-align: center; padding: 10px; color: gray;">${t('no_history')}</td></tr>`;
            } else {
                myApps.forEach(app => {
                    let statusHtml = ''; let reasonText = '-';
                    if (app.status === 'pending') {
                        statusHtml = `<span style="color: #ff9800; font-weight: bold;">${t('pending')}</span>`;
                    } else if (app.status === 'approved') {
                        statusHtml = `<span style="color: #2e7d32; font-weight: bold;">${t('approved')}</span>`;
                        reasonText = `<span style="color: #2e7d32;">${t('bonus_sent')}</span>`;
                    } else if (app.status === 'rejected') {
                        statusHtml = `<span style="color: #F44336; font-weight: bold;">${t('rejected')}</span>`;
                        reasonText = `<span style="color: #F44336;">${app.reason}</span>`;
                    }
                    historyHtml += `<tr><td style="padding: 8px; border-bottom: 1px solid #ddd;">${app.time}</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${statusHtml}</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${reasonText}</td></tr>`;
                });
            }
            historyHtml += `</tbody></table></div>`;

            document.getElementById('memberDisplay').innerHTML = `
                <div style="background: linear-gradient(135deg, #2b5876 0%, #4e4376 100%); color: white; padding: 25px; border-radius: 15px; box-shadow: 0 10px 20px rgba(0,0,0,0.2); text-align: left;">
                    <h3 style="margin: 0 0 5px 0; font-size: 16px; opacity: 0.8;">${t('wallet_title')}</h3>
                    <div style="font-size: 36px; font-weight: bold; margin-bottom: 20px;">$ ${balance}</div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn" style="margin-top:0; background-color: #00C300; font-size: 14px; padding: 10px;" onclick="openLinePayMock()">${t('linepay_btn')}</button>
                        <button class="btn" style="margin-top:0; background-color: rgba(255,255,255,0.2); border: 1px solid white; font-size: 14px; padding: 10px;" onclick="redeemPromoCode()">${t('promo_btn')}</button>
                    </div>
                </div>
                ${historyHtml}
            `;
        }

        function openLinePayMock() {
            let amount = prompt(t('prompt_linepay'));
            if (!amount || isNaN(amount) || amount <= 0) return alert(t('err_amount'));
            alert(t('alt_line_wait'));
            setTimeout(() => {
                if (confirm(t('cfm_linepay_1') + amount + t('cfm_linepay_2'))) {
                    let currentBalance = parseInt(localStorage.getItem('accountBalance') || '0');
                    localStorage.setItem('accountBalance', (currentBalance + parseInt(amount)).toString());
                    alert(t('alt_line_ok')); renderMemberCenter();
                } else { alert(t('alt_cancel')); }
            }, 1500);
        }

        function redeemPromoCode() {
            let code = prompt(t('prompt_promo'));
            if (!code) return;
            code = code.toUpperCase();
            if (validPromoCodes[code]) {
                if (validPromoCodes[code].used) { alert(t('err_promo_used')); } 
                else {
                    let bonus = validPromoCodes[code].amount;
                    let currentBalance = parseInt(localStorage.getItem('accountBalance') || '0');
                    localStorage.setItem('accountBalance', (currentBalance + bonus).toString());
                    validPromoCodes[code].used = true;
                    alert(t('alt_promo_ok') + bonus + t('alt_promo_ok2')); renderMemberCenter();
                }
            } else { alert(t('err_promo_invalid')); }
        }

        function confirmBikeUpload() {
            let pic1 = document.getElementById('bikePic1').value;
            let pic2 = document.getElementById('bikePic2').value;
            let pic3 = document.getElementById('bikePic3').value;

            if (!pic1 || !pic2 || !pic3) return alert(t('err_upload'));

            document.getElementById('bikePic1').value = "";
            document.getElementById('bikePic2').value = "";
            document.getElementById('bikePic3').value = "";

            applicationHistory.push({ 
                id: Date.now(), 
                studentId: currentUser, 
                time: new Date().toLocaleTimeString(),
                status: 'pending', 
                reason: ''
            });

            alert(t('alt_upload_ok')); 
            switchView('mainMenuSection');
        }

        function submitRepair() {
            let bikeId = document.getElementById('repairBikeId').value;
            let desc = document.getElementById('repairDesc').value;
            if(!bikeId || !desc) return alert(t('err_empty'));
            if (serverBikeDatabase[bikeId]) {
                serverBikeDatabase[bikeId].status = "maintenance";
                if (bikeMarkers[bikeId]) { map.removeLayer(bikeMarkers[bikeId]); delete bikeMarkers[bikeId]; }
            }
            repairQueue.push({ bikeId: bikeId, desc: desc, time: new Date().toLocaleTimeString() });
            alert(t('alt_rep_ok')); switchView('mainMenuSection');
        }

        function renderAdminDashboard() {
            let repairHtml = "";
            if (repairQueue.length === 0) repairHtml = `<tr><td colspan='3' style='text-align:center; color:gray;'>${t('empty_rep')}</td></tr>`;
            repairQueue.forEach((item, i) => {
                repairHtml += `<tr><td style="color:#F44336; font-weight:bold;">${item.bikeId}</td><td>${item.desc}</td>
                <td><button class="action-btn btn-approve" onclick="resolveRepair(${i}, '${item.bikeId}')">${t('btn_fix')}</button></td></tr>`;
            });
            document.getElementById('adminRepairTable').innerHTML = repairHtml;

            let pendingApps = applicationHistory.filter(app => app.status === 'pending');
            let approvalHtml = "";
            if (pendingApps.length === 0) approvalHtml = `<tr><td colspan='3' style='text-align:center; color:gray;'>${t('empty_appr')}</td></tr>`;
            
            pendingApps.forEach((item) => {
                approvalHtml += `<tr><td>${item.studentId}</td><td>${item.time}<br><span style="color:#2e7d32;font-size:11px;">${t('appr_photo_msg')}</span></td>
                <td><button class="action-btn btn-approve" onclick="approveBike(${item.id}, '${item.studentId}')">${t('btn_approve')}</button>
                <button class="action-btn btn-reject" onclick="rejectBike(${item.id})">${t('btn_reject')}</button></td></tr>`;
            });
            document.getElementById('adminApprovalTable').innerHTML = approvalHtml;
        }

        function resolveRepair(index, bikeId) {
            repairQueue.splice(index, 1);
            if (serverBikeDatabase[bikeId]) {
                serverBikeDatabase[bikeId].status = "active";
                if (isMapInitialized) {
                    let icon = L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/3198/3198336.png', iconSize: [40,40], iconAnchor: [20,40] });
                    createBikeMarker(bikeId, serverBikeDatabase[bikeId].lat, serverBikeDatabase[bikeId].lng, icon);
                }
            }
            alert(t('alt_fix_ok') + bikeId + t('alt_fix_ok2')); renderAdminDashboard();
        }

        function approveBike(appId, studentId) {
            let app = applicationHistory.find(a => a.id === appId);
            if(app) app.status = 'approved';

            let newBikeId = "NCU-00" + (Object.keys(serverBikeDatabase).length + 1);
            let newLat = 24.968 + (Math.random() - 0.5) * 0.005, newLng = 121.192 + (Math.random() - 0.5) * 0.005;
            serverBikeDatabase[newBikeId] = { lat: newLat, lng: newLng, pwd: "0000", status: "active" };
            
            let currentBalance = parseInt(localStorage.getItem('accountBalance') || '0');
            localStorage.setItem('accountBalance', (currentBalance + 50).toString());

            if(isMapInitialized) {
                let icon = L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/3198/3198336.png', iconSize: [40,40], iconAnchor: [20,40] });
                createBikeMarker(newBikeId, newLat, newLng, icon);
            }
            
            alert(t('alt_approve_ok1') + newBikeId + t('alt_approve_ok2')); 
            renderAdminDashboard(); 
        }
        // 新增一個進入報修頁面的函式
            function enterRepairPage() {
            checkAuth(() => {
            switchView('repairSection');
            });
        }
        function rejectBike(appId) {
            let reason = prompt(t('prompt_reject'));
            if (reason === null) return; 

            let app = applicationHistory.find(a => a.id === appId);
            if(app) {
                app.status = 'rejected';
                app.reason = reason.trim() === "" ? t('default_reject') : reason;
            }
            
            alert(t('alt_reject_ok')); 
            renderAdminDashboard(); 
        }

        let map, isMapInitialized = false, bikeMarkers = {};
        let selectedBikeToRent = null, currentRentedBike = null, rideInterval = null, rideSeconds = 0;

        function enterMap() {
            switchView('mapSection');
            if (!isMapInitialized) {
                map = L.map('map').setView([24.96815, 121.19242], 16);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                let icon = L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/3198/3198336.png', iconSize: [40, 40], iconAnchor: [20, 40] });
                for(let bikeId in serverBikeDatabase) { 
                    if(serverBikeDatabase[bikeId].status === "active") createBikeMarker(bikeId, serverBikeDatabase[bikeId].lat, serverBikeDatabase[bikeId].lng, icon); 
                }
                isMapInitialized = true;
            }
            setTimeout(() => { map.invalidateSize(); }, 100);
        }

        function createBikeMarker(id, lat, lng, iconDef) {
            let marker = L.marker([lat, lng], {icon: iconDef}).addTo(map);
            marker.on('click', function() {
                if(currentRentedBike !== null) return alert(t('err_renting'));
                selectedBikeToRent = id; 
                document.getElementById('inputPlateNum').value = id; 
                document.getElementById('inputEPassword').value = ""; 
                
                console.log(`[提示] 您選擇的車號 ${id}，解鎖密碼為: ${serverBikeDatabase[id].pwd}`);
                
                document.getElementById('rentVerifyPanel').style.display = 'block';
            });
            bikeMarkers[id] = marker; 
        }

        function closeRentPanel() { document.getElementById('rentVerifyPanel').style.display = 'none'; selectedBikeToRent = null; }

        function confirmRent() {
            let plateNum = document.getElementById('inputPlateNum').value;
            let ePwd = document.getElementById('inputEPassword').value;

            let balance = parseInt(localStorage.getItem('accountBalance') || '0');
            if(balance < 5) return alert(t('err_bal'));
            
            if (ePwd !== serverBikeDatabase[plateNum].pwd) return alert(t('err_pwd'));

            localStorage.setItem('accountBalance', (balance - 5).toString());
            closeRentPanel();
            if (bikeMarkers[plateNum]) { map.removeLayer(bikeMarkers[plateNum]); delete bikeMarkers[plateNum]; }

            alert(t('alt_rent_ok') + (balance - 5) + t('alt_rent_ok2'));
            currentRentedBike = plateNum;
            document.getElementById('rentedBikeId').innerText = plateNum;
            document.getElementById('activeRidePanel').style.display = 'block';

            rideSeconds = 0; document.getElementById('rideTimer').innerText = "00:00";
            rideInterval = setInterval(() => {
                rideSeconds++;
                let m = Math.floor(rideSeconds / 60).toString().padStart(2, '0');
                let s = (rideSeconds % 60).toString().padStart(2, '0');
                document.getElementById('rideTimer').innerText = m + ":" + s;
            }, 1000);
        }

        function returnBike() {
            clearInterval(rideInterval);
            let timeStr = document.getElementById('rideTimer').innerText;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(pos) { finishReturn(pos.coords.latitude, pos.coords.longitude, timeStr); },
                    function(err) { finishReturn(map.getCenter().lat, map.getCenter().lng, timeStr); }
                );
            } else { finishReturn(map.getCenter().lat, map.getCenter().lng, timeStr); }
        }

        function finishReturn(lat, lng, timeStr) {
            document.getElementById('activeRidePanel').style.display = 'none';
            serverBikeDatabase[currentRentedBike].lat = lat; serverBikeDatabase[currentRentedBike].lng = lng;
            let icon = L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/3198/3198336.png', iconSize: [40,40], iconAnchor: [20,40] });
            createBikeMarker(currentRentedBike, lat, lng, icon); map.setView([lat, lng], 16);
            
            let carbonSaved = Math.round(rideSeconds * 1.04); 
            
            let currentTotal = parseInt(localStorage.getItem('NCU_TotalCarbon') || '0');
            let currentDaily = parseInt(localStorage.getItem('NCU_DailyCarbon') || '0');
            
            localStorage.setItem('NCU_TotalCarbon', (currentTotal + carbonSaved).toString());
            localStorage.setItem('NCU_DailyCarbon', (currentDaily + carbonSaved).toString());
            localStorage.setItem('NCU_CarbonDate', new Date().toLocaleDateString());

            alert(t('alt_ret_ok') + timeStr + t('alt_ret_ok2') + carbonSaved + t('alt_ret_ok3')); 
            currentRentedBike = null;
        }

        function enterCarbonPage() {
            checkAuth(() => {
            let today = new Date().toLocaleDateString();
            
            if (localStorage.getItem('NCU_CarbonDate') !== today) {
                localStorage.setItem('NCU_DailyCarbon', '0');
                localStorage.setItem('NCU_CarbonDate', today);
            }

            document.getElementById('dailyCarbon').innerText = localStorage.getItem('NCU_DailyCarbon') || '0';
            document.getElementById('totalCarbon').innerText = localStorage.getItem('NCU_TotalCarbon') || '0';
            
            switchView('carbonSection');
            });
        }

        // 初始化預設為中文
        changeLang('zh'); 
        renderUserMenu(); // <--- 確保網頁重新整理時也會跑一次