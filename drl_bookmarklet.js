/**
 * ==============================================================================
 * SMART BOOKMARKLET: UEH-ISB DRL TRACKER (K50 IBUS) - PHIÊN BẢN 3.5
 * ==============================================================================
 * Cập nhật chuẩn xác theo cơ chế Điểm Rèn Luyện UEH & Khớp 100% Tracking DRL.xlsx:
 *  - Tự động cộng các mục ĐƯỢC CHO SẴN MẶC ĐỊNH (tô xanh dương trong Tracking DRL.xlsx):
 *      + 1.1: Ý thức chấp hành pháp luật, nội quy quy chế (+15.0đ)
 *      + 2.1: Ý thức trách nhiệm trong học tập (+10.0đ)
 *      + 2.2.1: Điểm xếp loại học tập (Giỏi +4.0đ / Xuất sắc +5.0đ / Khá +3.0đ)
 *      + 3.1: Có trách nhiệm tham gia hoạt động chính trị - xã hội (+5.0đ)
 *      + 4.1: Sinh hoạt tại cộng đồng (+10.0đ)
 *      + 5.1: Tinh thần trách nhiệm, thái độ làm việc, uy tín (+10.0đ)
 *    ==> Tổng điểm cơ sở cho sẵn = 54.0 điểm!
 *  - Cộng dồn với điểm hoạt động ngoại khóa thực tế tích lũy trên web DRS.
 *  - Đối soát chính xác ngưỡng Học bổng Viện ISB (Khá 65 - Tốt 80 - Xuất sắc 90).
 * ==============================================================================
 */

(function initTracker() {
    // 1. Kiểm tra URL trang DRS
    if (!window.location.hostname.includes("drs.ueh.edu.vn")) {
        if (confirm("⚠️ Bạn cần mở trang Điểm Rèn Luyện UEH (drs.ueh.edu.vn) để sử dụng công cụ này.\n\nBạn có muốn mở drs.ueh.edu.vn ngay bây giờ không?")) {
            window.location.href = "https://drs.ueh.edu.vn/Student/TrainingScore";
        }
        return;
    }

    if (!window.location.pathname.includes("/Student/TrainingScore")) {
        if (confirm("💡 Để đọc chính xác bảng điểm chi tiết, bạn cần ở trang 'Xem điểm rèn luyện'.\n\nChuyển đến trang Xem điểm ngay bây giờ?")) {
            window.location.href = "https://drs.ueh.edu.vn/Student/TrainingScore";
            return;
        }
    }

    // Đóng popup cũ nếu đang mở
    var existingModal = document.getElementById("ueh-drl-tracker-hud");
    if (existingModal) {
        existingModal.remove();
    }

    // 2. Cài đặt các mục Cho Sẵn (Default Points từ Tracking DRL.xlsx)
    var savedGpaTier = localStorage.getItem("ueh_drl_gpa_tier") || "gioi"; // xuatsac, gioi, kha, tb
    var savedIncludeDefaults = localStorage.getItem("ueh_drl_inc_defaults") !== "false"; // default true

    var gpaPointsMap = {
        "xuatsac": { label: "Xuất sắc (≥ 3.6)", pts: 5.0 },
        "gioi": { label: "Giỏi (3.2 - 3.59)", pts: 4.0 },
        "kha": { label: "Khá (2.5 - 3.19)", pts: 3.0 },
        "tb": { label: "Trung bình (< 2.5)", pts: 2.0 }
    };

    var currentGpaPts = gpaPointsMap[savedGpaTier]?.pts || 4.0;

    // Cấu hình 5 Tiêu chí chuẩn theo Tracking DRL.xlsx
    var tcConfig = {
        TC1: {
            code: "TC1",
            num: 1,
            name: "Chấp hành pháp luật, nội quy, quy chế",
            fullName: "Đánh giá trách nhiệm chấp hành pháp luật và nội quy, quy chế của UEH",
            max: 25,
            defaultPts: 15.0, // Mục 1.1: 15đ
            defaultDesc: "Mục 1.1 cho sẵn (15đ)",
            keywords: ["mục 1", "tiêu chí 1", "nhóm 1", "chấp hành pháp luật", "nội quy", "quy chế", "sinh hoạt công dân"]
        },
        TC2: {
            code: "TC2",
            num: 2,
            name: "Thái độ và trách nhiệm trong học tập",
            fullName: "Trách nhiệm, tinh thần và thái độ trong học tập tại UEH",
            max: 20,
            defaultPts: 10.0 + currentGpaPts, // Mục 2.1: 10đ + GPA (Giỏi 4đ) = 14đ
            defaultDesc: "Mục 2.1 cho sẵn (10đ) + GPA (" + currentGpaPts + "đ)",
            keywords: ["mục 2", "tiêu chí 2", "nhóm 2", "thái độ trong học tập", "học vụ", "khảo thí", "nckh", "khởi nghiệp", "trao đổi sinh viên", "học thuật"]
        },
        TC3: {
            code: "TC3",
            num: 3,
            name: "Văn hóa, thể thao, phát triển bền vững",
            fullName: "Hoạt động chính trị, văn hóa, thể thao, phát triển bền vững & Đại học Xanh",
            max: 20,
            defaultPts: 5.0, // Mục 3.1: 5đ
            defaultDesc: "Mục 3.1 cho sẵn (5đ)",
            keywords: ["mục 3", "tiêu chí 3", "nhóm 3", "chính trị", "văn hóa", "văn nghệ", "thể thao", "phát triển bền vững", "đại học xanh", "môi trường", "tình nguyện sinh viên"]
        },
        TC4: {
            code: "TC4",
            num: 4,
            name: "Ý thức công dân trong quan hệ cộng đồng",
            fullName: "Đánh giá về ý thức công dân trong quan hệ cộng đồng",
            max: 15,
            defaultPts: 10.0, // Mục 4.1: 10đ
            defaultDesc: "Mục 4.1 cho sẵn (10đ)",
            keywords: ["mục 4", "tiêu chí 4", "nhóm 4", "quan hệ cộng đồng", "sinh hoạt tại cộng đồng", "nội - ngoại trú", "nơi cư trú"]
        },
        TC5: {
            code: "TC5",
            num: 5,
            name: "Cán sự lớp, đoàn thể & Thành tích thi đua",
            fullName: "Công tác cán bộ lớp, đoàn thể, tổ chức & Thành tích đặc biệt, khen thưởng",
            max: 20,
            defaultPts: 10.0, // Mục 5.1: 10đ
            defaultDesc: "Mục 5.1 cho sẵn (10đ)",
            keywords: ["mục 5", "tiêu chí 5", "nhóm 5", "cán bộ lớp", "cán sự", "đoàn thể", "chi đoàn", "chi hội", "câu lạc bộ", "khen thưởng", "sinh viên 5 tốt", "giấy khen", "bằng khen", "thành tích"]
        }
    };

    var studentName = "Sinh viên K50";
    var studentId = "";
    var semester = "Học kỳ hiện tại";
    var webScores = { TC1: 0, TC2: 0, TC3: 0, TC4: 0, TC5: 0 };

    // 3. Trích xuất thông tin sinh viên & Học kỳ
    try {
        var userText = document.querySelector(".user-info-ueh, .navbar-nav-ueh, header, .navbar")?.innerText || "";
        var idMatch = userText.match(/\b(31\d{6,8}|\d{8,10})\b/);
        if (idMatch) studentId = idMatch[1];
        
        var nameMatch = userText.match(/Chào,?\s*([^\n\r\|•]+)/i) || userText.match(/([A-ZÀ-Ỹ][a-zà-ỹ]+(?:\s+[A-ZÀ-Ỹ][a-zà-ỹ]+){1,4})/);
        if (nameMatch) studentName = nameMatch[1].trim();
        
        var semEl = document.querySelector("select[name*='HocKy'], select[name*='Semester'], .activity-filters, h2, h3");
        if (semEl) {
            var semText = semEl.innerText || semEl.value || "";
            var sMatch = semText.match(/Học kỳ\s*\d+(\s*-\s*\d+)?(\s*năm\s*\d{4}-\d{4})?/i);
            if (sMatch) semester = sMatch[0];
        }
    } catch (e) {
        console.warn("Lỗi đọc info SV", e);
    }

    // 4. Trích xuất điểm từ web DRS
    try {
        // Cách 1: Quét trực tiếp các thẻ điểm .score-group-card (chính xác nhất trên giao diện DRS)
        var groupCards = document.querySelectorAll(".score-group-card");
        if (groupCards.length === 0) {
            groupCards = document.querySelectorAll(".score-card");
        }

        groupCards.forEach(function (card) {
            var cardText = card.innerText.trim();
            var lowerText = cardText.toLowerCase();

            // Bỏ qua các thẻ không phải 5 tiêu chí: Green Citizens (1.G, 2.G, 3.G, 4.G), thẻ đếm hoạt động, chờ duyệt
            if (/^[1-4]\.g/i.test(cardText) || lowerText.includes("green campus") || lowerText.includes("hoạt động xanh") || lowerText.includes("lối sống xanh") || lowerText.includes("số hoạt động") || lowerText.includes("chờ duyệt") || lowerText.includes("lịch sử")) {
                return;
            }

            var scoreVal = null;
            var scoreEl = card.querySelector(".current-score");
            if (scoreEl) {
                var sVal = parseFloat(scoreEl.innerText.replace(",", "."));
                if (!isNaN(sVal)) scoreVal = sVal;
            }

            if (scoreVal === null) {
                var sm = cardText.match(/(\d+(?:[.,]\d+)?)\s*\/\s*\d+/);
                if (sm) scoreVal = parseFloat(sm[1].replace(",", "."));
            }

            if (scoreVal !== null && !isNaN(scoreVal)) {
                // Ưu tiên khớp chính xác số thứ tự "Mục X" hoặc "Tiêu chí X" hoặc "Nhóm X" (1 đến 5)
                var numMatch = cardText.match(/(?:mục|tiêu\s*chí|nhóm)\s*([1-5])(?!\.g|\s*\.g|\w)\b/i);
                if (numMatch) {
                    var tcKey = "TC" + numMatch[1];
                    webScores[tcKey] = scoreVal;
                    return;
                }

                // Fallback theo từ khóa đặc thù
                for (var key in tcConfig) {
                    var cfg = tcConfig[key];
                    for (var k = 0; k < cfg.keywords.length; k++) {
                        if (lowerText.includes(cfg.keywords[k])) {
                            webScores[key] = scoreVal;
                            return;
                        }
                    }
                }
            }
        });

        // Cách 2: Quét bảng chi tiết nếu có tiêu chí nào chưa đọc được (chế độ xem Table chi tiết)
        var hasMissing = Object.values(webScores).some(function (v) { return v === 0; });
        if (hasMissing) {
            var tables = document.querySelectorAll("table");
            tables.forEach(function (table) {
                var rows = table.querySelectorAll("tr");
                rows.forEach(function (row) {
                    var cells = row.querySelectorAll("td, th");
                    if (cells.length >= 3) {
                        var col0 = cells[0].innerText.trim();
                        var numMatch = col0.match(/^([1-5])$/);
                        if (numMatch) {
                            var tcKey = "TC" + numMatch[1];
                            if (webScores[tcKey] === 0) {
                                var parsed = parseFloat(cells[2].innerText.trim().replace(",", "."));
                                if (!isNaN(parsed)) {
                                    webScores[tcKey] = parsed;
                                }
                            }
                        }
                    }
                });
            });
        }

    } catch (e) {
        console.warn("Lỗi đọc điểm từ web DRS", e);
    }

    // 4b. Trích xuất danh sách hoạt động đã tham gia (khớp 100% cấu trúc Listing DRL trong Tracking DRL.xlsx)
    var registeredActivities = [];
    try {
        var actTable = document.querySelector(".activity-table, table.table-hover");
        if (actTable) {
            var aRows = actTable.querySelectorAll("tbody tr");
            if (aRows.length === 0) {
                aRows = actTable.querySelectorAll("tr:not(:first-child)");
            }
            aRows.forEach(function (row) {
                var cells = row.querySelectorAll("td");
                if (cells.length >= 6) {
                    var cell0 = cells[0];
                    var rawTitle = cell0.innerText.trim();
                    var role = cells[1] ? cells[1].innerText.trim() : "";
                    var org = cells[2] ? cells[2].innerText.trim() : "";
                    var date = cells[3] ? cells[3].innerText.trim() : "";
                    var group = cells[4] ? cells[4].innerText.trim() : "";
                    var status = cells[5] ? cells[5].innerText.trim() : "";
                    var pointsText = cells[6] ? cells[6].innerText.trim() : "";

                    var linkEl = row.querySelector("a[href*='/activity/Details/'], a[href*='/Details/'], a[href*='activity']");
                    var actLink = linkEl ? linkEl.href : "";
                    var codeMatch = actLink.match(/\/Details\/([A-Za-z0-9_]+)/i) || rawTitle.match(/\b(\d{4}_[A-Za-z0-9_]+)\b/);
                    var actCode = codeMatch ? codeMatch[1] : "";

                    var critMatch = rawTitle.match(/\b([1-5]\.\d+(?:\.\d+)*)\b/);
                    var criteriaCode = critMatch ? critMatch[1] : "";

                    var titleLines = rawTitle.split("\n").map(function(s){ return s.trim(); }).filter(Boolean);
                    var cleanTitle = titleLines[0] || rawTitle;
                    cleanTitle = cleanTitle.replace(/\s*[1-5]\.\d+(?:\.\d+)*\s*[-–—|].*$/, "").trim();

                    var ptMatch = pointsText.match(/(\d+(?:[.,]\d+)?)/) || rawTitle.match(/Điểm:\s*(\d+(?:[.,]\d+)?)/i);
                    var actPts = ptMatch ? parseFloat(ptMatch[1].replace(",", ".")) : 0.0;

                    var isDone = status.toLowerCase().includes("hoàn thành") || actPts > 0;
                    var statusStr = isDone ? "100%" : "50%";

                    registeredActivities.push({
                        name: cleanTitle,
                        code: actCode,
                        criteria: criteriaCode,
                        status: statusStr,
                        points: actPts,
                        fee: "",
                        link: actLink,
                        note: status + (date ? " (" + date + ")" : ""),
                        role: role,
                        org: org,
                        date: date
                    });
                }
            });
        }
    } catch (e) {
        console.warn("Lỗi trích xuất hoạt động đã tham gia:", e);
    }

    // 5. Tính toán Điểm Thực Tế & Phân rã Điểm Nền tảng vs Điểm Hoạt động
    var scores = {};
    var totalDefaultPoints = 0;
    var totalWebActivitiesPoints = 0;
    var totalScore = 0;

    var criteriaAnalysis = [];
    var deficientList = [];

    // Điểm nền tảng cố định cho từng tiêu chí (chuẩn Tracking DRL.xlsx & Quy chế UEH)
    var fixedBaseMap = {
        TC1: 15.0, // Mục 1.1: 15đ
        TC2: 10.0, // Mục 2.1: 10đ
        TC3: 5.0,  // Mục 3.1: 5đ
        TC4: 10.0, // Mục 4.1: 10đ
        TC5: 10.0  // Mục 5.1: 10đ
    };

    for (var tcKey in tcConfig) {
        var cfg = tcConfig[tcKey];
        var fixedBase = fixedBaseMap[tcKey] || 0;
        var gpaBonus = (tcKey === "TC2") ? currentGpaPts : 0;
        var totalDefForTC = fixedBase + gpaBonus;

        var rawWebVal = webScores[tcKey] || 0;

        // Điểm hoạt động ngoại khóa thực tế:
        // Trên web DRS, nếu rawWebVal >= fixedBase, nghĩa là web đã gồm điểm nền tảng.
        // Riêng TC2, web mặc định có 10đ nền tảng + 4đ GPA Giỏi (mục 2.2.1)
        var actPts = 0;
        if (tcKey === "TC2") {
            var webBaseGPA = 4.0;
            if (rawWebVal >= (fixedBase + webBaseGPA)) {
                actPts = rawWebVal - (fixedBase + webBaseGPA);
            } else if (rawWebVal >= fixedBase) {
                actPts = 0;
            } else {
                actPts = rawWebVal;
            }
        } else {
            if (rawWebVal >= fixedBase) {
                actPts = rawWebVal - fixedBase;
            } else {
                actPts = rawWebVal;
            }
        }

        var finalPts = 0;
        var defPts = savedIncludeDefaults ? totalDefForTC : 0;

        if (savedIncludeDefaults) {
            finalPts = Math.min(cfg.max, totalDefForTC + actPts);
        } else {
            finalPts = Math.min(cfg.max, actPts);
        }

        totalDefaultPoints += defPts;
        totalWebActivitiesPoints += actPts;
        scores[tcKey] = finalPts;
        totalScore += finalPts;

        var diff = Math.max(0, cfg.max - finalPts);
        var isCapped = finalPts >= cfg.max;

        if (diff > 0) {
            deficientList.push({ code: tcKey, name: cfg.name, diff: diff, max: cfg.max, current: finalPts });
        }

        criteriaAnalysis.push({
            code: tcKey,
            num: cfg.num,
            name: cfg.name,
            fullName: cfg.fullName,
            defaultPts: defPts,
            webPts: actPts,
            current: finalPts,
            max: cfg.max,
            diff: diff,
            isCapped: isCapped,
            percent: Math.min(100, Math.round((finalPts / cfg.max) * 100))
        });
    }

    deficientList.sort(function (a, b) { return b.diff - a.diff; });

    // 6. Đánh giá Học bổng Viện ISB cho K50 IBUS
    var scholarshipStatus = "";
    var scholarshipColor = "#10B981";
    var nextMilestoneText = "";
    var currentRank = "";

    if (totalScore >= 90) {
        currentRank = "Xuất sắc (≥ 90)";
        scholarshipStatus = "🌟 Đủ điều kiện xét Học bổng Xuất sắc ISB (150% toàn phần)";
        scholarshipColor = "#10B981";
        nextMilestoneText = "🎉 Chúc mừng bạn! Bạn đã đạt mức điểm tối ưu cao nhất để xét Học bổng.";
    } else if (totalScore >= 80) {
        currentRank = "Tốt (80 - 89)";
        scholarshipStatus = "⭐ Đủ điều kiện xét Học bổng Giỏi ISB (120% toàn phần)";
        scholarshipColor = "#3B82F6";
        var gap = (90 - totalScore).toFixed(1);
        nextMilestoneText = "⚡ Chỉ còn thiếu <b>" + gap + " điểm</b> nữa để nâng hạng lên Học bổng Xuất sắc (≥ 90đ)!";
    } else if (totalScore >= 65) {
        currentRank = "Khá (65 - 79)";
        scholarshipStatus = " Đủ điều kiện xét Học bổng Khá ISB (100% toàn phần)";
        scholarshipColor = "#F59E0B";
        var gap = (80 - totalScore).toFixed(1);
        nextMilestoneText = "⚡ Chỉ còn thiếu <b>" + gap + " điểm</b> nữa để nâng hạng lên Học bổng Giỏi (≥ 80đ)!";
    } else if (totalScore >= 50) {
        currentRank = "Trung bình (50 - 64)";
        scholarshipStatus = "⚠️ Chưa đủ điều kiện xét Học bổng ISB (Cần tối thiểu Khá ≥ 65đ)";
        scholarshipColor = "#F97316";
        var gap = (65 - totalScore).toFixed(1);
        nextMilestoneText = "🚨 Báo động: Cần tích lũy thêm tối thiểu <b>" + gap + " điểm</b> để chạm ngưỡng Học bổng Khá!";
    } else {
        currentRank = "Yếu / Kém (< 50)";
        scholarshipStatus = " Cảnh báo: Nguy cơ điểm rèn luyện yếu!";
        scholarshipColor = "#EF4444";
        var gap = (65 - totalScore).toFixed(1);
        nextMilestoneText = "🚨 Báo động: Cần tích lũy thêm tối thiểu <b>" + gap + " điểm</b> để đạt mức Khá.";
    }

    // 7. Tạo giao diện Floating HUD (macOS Glassmorphism UI)
    var hud = document.createElement("div");
    hud.id = "ueh-drl-tracker-hud";
    hud.style.cssText = [
        "position: fixed",
        "top: 20px",
        "right: 20px",
        "width: 450px",
        "max-height: 92vh",
        "background: rgba(255, 255, 255, 0.95)",
        "backdrop-filter: blur(20px)",
        "-webkit-backdrop-filter: blur(20px)",
        "border: 1px solid rgba(0, 95, 105, 0.25)",
        "border-radius: 20px",
        "box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.6) inset",
        "z-index: 999999",
        "font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
        "color: #1E293B",
        "overflow-y: auto",
        "padding: 0",
        "transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "animation: uehSlideIn 0.35s ease-out"
    ].join(";");

    if (!document.getElementById("ueh-tracker-style")) {
        var styleSheet = document.createElement("style");
        styleSheet.id = "ueh-tracker-style";
        styleSheet.innerText = `
            @keyframes uehSlideIn {
                from { opacity: 0; transform: translateY(-20px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            #ueh-drl-tracker-hud::-webkit-scrollbar { width: 6px; }
            #ueh-drl-tracker-hud::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
            .ueh-hud-tab-btn.active { background: #005F69 !important; color: white !important; }
            .ueh-act-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        `;
        document.head.appendChild(styleSheet);
    }

    var webhookUrl = localStorage.getItem("ueh_drl_webhook_url") || "";

    hud.innerHTML = `
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #005F69 0%, #008891 100%); color: white; padding: 16px 20px; border-radius: 19px 19px 0 0; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="background: rgba(255,255,255,0.2); width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px;">🎯</div>
                <div>
                    <div style="font-weight: 700; font-size: 15px; letter-spacing: -0.2px;">UEH.ISB DRL Tracker</div>
                    <div style="font-size: 11px; opacity: 0.85;">K50 IBUS • Chuẩn 5 Tiêu chí TrackingDRL</div>
                </div>
            </div>
            <div style="display: flex; gap: 8px;">
                <button id="ueh-hud-min-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 26px; height: 26px; border-radius: 50%; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center;">_</button>
                <button id="ueh-hud-close-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 26px; height: 26px; border-radius: 50%; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center;">✕</button>
            </div>
        </div>

        <div id="ueh-hud-body" style="padding: 18px 20px;">
            <!-- Thẻ Điểm Tổng & Phân Rã Thành Phần -->
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 16px; margin-bottom: 14px; text-align: center;">
                <div style="font-size: 11px; color: #64748B; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">TỔNG ĐIỂM RÈN LUYỆN DỰ KIẾN</div>
                <div style="font-size: 40px; font-weight: 800; color: #005F69; margin: 2px 0 2px 0;">
                    ${totalScore.toFixed(1)} <span style="font-size: 18px; color: #94A3B8; font-weight: 500;">/ 100</span>
                </div>
                
                <!-- Badge Điểm thành phần -->
                <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
                    <span style="background: #CFF4FC; color: #055160; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 8px; border: 1px solid #B6EFFB;">
                        💎 Cho sẵn: ${totalDefaultPoints.toFixed(1)}đ
                    </span>
                    <span style="background: #E2E8F0; color: #334155; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 8px;">
                        🌐 Web DRS: ${totalWebActivitiesPoints.toFixed(1)}đ
                    </span>
                    <span style="background: ${scholarshipColor}1A; color: ${scholarshipColor}; font-weight: 700; font-size: 11px; padding: 3px 8px; border-radius: 8px; border: 1px solid ${scholarshipColor}33;">
                        Hạng: ${currentRank}
                    </span>
                </div>

                <div style="font-size: 12px; font-weight: 600; color: #1E293B; margin-bottom: 6px;">
                    ${scholarshipStatus}
                </div>
                <div style="font-size: 11px; color: #475569; background: #FFFFFF; padding: 8px 12px; border-radius: 10px; border: 1px dashed #CBD5E1; line-height: 1.4;">
                    ${nextMilestoneText}
                </div>
            </div>

            <!-- Khối Tùy chỉnh Điểm Cho Sẵn & GPA -->
            <div style="background: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 12px; padding: 10px 12px; margin-bottom: 14px; font-size: 11px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <label style="display: flex; align-items: center; gap: 6px; font-weight: 700; color: #005F69; cursor: pointer;">
                        <input type="checkbox" id="ueh-toggle-defaults" ${savedIncludeDefaults ? "checked" : ""} style="cursor: pointer;" />
                        <span>Cộng điểm cho sẵn (1.1, 2.1, 3.1, 4.1, 5.1)</span>
                    </label>
                    <span style="color: #0369A1; font-weight: 700;">+50.0đ</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #475569; font-weight: 600;">Xếp loại học tập (Mục 2.2.1):</span>
                    <select id="ueh-gpa-select" style="padding: 2px 6px; font-size: 11px; border-radius: 6px; border: 1px solid #CBD5E1; background: white; color: #005F69; font-weight: 700; cursor: pointer;">
                        <option value="xuatsac" ${savedGpaTier === "xuatsac" ? "selected" : ""}>Xuất sắc (+5đ)</option>
                        <option value="gioi" ${savedGpaTier === "gioi" ? "selected" : ""}>Giỏi (+4đ)</option>
                        <option value="kha" ${savedGpaTier === "kha" ? "selected" : ""}>Khá (+3đ)</option>
                        <option value="tb" ${savedGpaTier === "tb" ? "selected" : ""}>Trung bình (+2đ)</option>
                    </select>
                </div>
            </div>

            <!-- Tab Điều hướng: 5 Tiêu chí vs Hoạt động gợi ý -->
            <div style="display: flex; gap: 8px; margin-bottom: 12px; background: #E2E8F0; padding: 3px; border-radius: 10px;">
                <button id="tab-btn-scores" class="ueh-hud-tab-btn active" style="flex: 1; border: none; padding: 7px 0; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;">📊 5 Tiêu Chí Chuẩn</button>
                <button id="tab-btn-acts" class="ueh-hud-tab-btn" style="flex: 1; border: none; padding: 7px 0; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; background: transparent; color: #475569; transition: all 0.2s;">🎯 Hoạt Động Gợi Ý <span id="act-badge-count" style="background:#EF4444; color:white; font-size:9px; padding:1px 5px; border-radius:10px; margin-left:2px;">...</span></button>
            </div>

            <!-- NỘI DUNG TAB 1: 5 Tiêu chí chuẩn theo Tracking DRL.xlsx -->
            <div id="tab-content-scores">
                <div style="font-size: 11px; font-weight: 700; color: #005F69; margin-bottom: 8px; display: flex; justify-content: space-between;">
                    <span>TIÊU CHÍ (TC1 - TC5)</span>
                    <span>ĐÃ ĐẠT / MAX</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;">
                    ${criteriaAnalysis.map(function (item) {
                        var barColor = item.isCapped ? "#10B981" : item.diff > 8 ? "#EF4444" : "#F59E0B";
                        var tag = item.isCapped 
                            ? `<span style="background: #DEF7EC; color: #03543F; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px;">ĐÃ MAX</span>`
                            : `<span style="background: #FEF3C7; color: #92400E; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px;">Thiếu ${item.diff.toFixed(1)}đ</span>`;
                        return `
                            <div style="background: white; border: 1px solid #E2E8F0; border-radius: 12px; padding: 10px 12px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
                                    <div style="font-size: 12px; font-weight: 600; color: #1E293B; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${item.fullName}">
                                        <b style="color: #005F69;">TC${item.num}:</b> ${item.name}
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 6px;">
                                        ${tag}
                                        <span style="font-size: 12px; font-weight: 700; color: #1E293B;">${item.current}/${item.max}</span>
                                    </div>
                                </div>
                                <div style="font-size: 10px; color: #64748B; margin-bottom: 4px;">
                                    ${item.defaultPts > 0 ? `<span style="color:#0284C7; font-weight:600;">💎 Cho sẵn: ${item.defaultPts}đ</span> • ` : ""}
                                    <span>🌐 DRS: ${item.webPts}đ</span>
                                </div>
                                <div style="background: #F1F5F9; height: 6px; border-radius: 10px; overflow: hidden;">
                                    <div style="background: ${barColor}; width: ${item.percent}%; height: 100%; border-radius: 10px; transition: width 0.5s ease;"></div>
                                </div>
                            </div>
                        `;
                    }).join("")}
                </div>
            </div>

            <!-- NỘI DUNG TAB 2: Hoạt động đang mở khớp với mục thiếu -->
            <div id="tab-content-acts" style="display: none;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 11px; font-weight: 600; color: #64748B;">Ưu tiên bù tiêu chí đang thiếu:</span>
                    <button id="ueh-copy-acts-btn" title="Sao chép danh sách hoạt động thành bảng tính (dán vào Sheet/Excel)" style="background: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                        📋 Copy Bảng Hoạt Động
                    </button>
                </div>
                <div id="ueh-acts-loading" style="text-align: center; padding: 20px; color: #64748B; font-size: 12px;">
                    <div style="font-size: 20px; margin-bottom: 6px;">⏳</div>
                    Đang quét hoạt động mở tại <b>/Student/AllActivities</b>...
                </div>
                <div id="ueh-acts-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow-y: auto; padding-right: 2px;"></div>
            </div>

            <!-- KHỐI ĐỒNG BỘ & COPY DỮ LIỆU -->
            <div style="margin-top: 14px; padding-top: 14px; border-top: 1px dashed #CBD5E1;">
                <div style="font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 6px; display: flex; justify-content: space-between;">
                    <span>GOOGLE APPS SCRIPT WEB APP URL:</span>
                    <a href="https://sheets.new" target="_blank" style="color: #005F69; text-decoration: none;">Tạo Sheet mới ↗</a>
                </div>
                <input id="ueh-webhook-input" type="text" placeholder="https://script.google.com/macros/s/.../exec" 
                    value="${webhookUrl}" 
                    style="width: 100%; box-sizing: border-box; padding: 8px 10px; font-size: 11px; border: 1px solid #CBD5E1; border-radius: 8px; margin-bottom: 8px; font-family: monospace;" />
                
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button id="ueh-sync-sheet-btn" style="background: #005F69; color: white; border: none; padding: 10px; border-radius: 10px; font-weight: 700; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,95,105,0.25);">
                        <span>🚀 Đồng bộ Google Sheet (Chuẩn Tracking DRL)</span>
                    </button>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <button id="ueh-copy-listing-btn" title="Sao chép toàn bộ hoạt động đã hoàn thành chuẩn 8 cột (dán trực tiếp vào tab Listing DRL của Tracking DRL.xlsx)" style="background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; padding: 9px 6px; border-radius: 10px; font-weight: 700; font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
                            📋 Copy Listing DRL (8 Cột)
                        </button>
                        <button id="ueh-copy-table-btn" title="Sao chép bảng phân rã 5 tiêu chí (dán vào sheet Đã cập nhật DRL hoặc Excel)" style="background: #EFF6FF; color: #1E40AF; border: 1px solid #BFDBFE; padding: 9px 6px; border-radius: 10px; font-weight: 700; font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
                            📊 Copy 5 Tiêu Chí
                        </button>
                    </div>
                    <button id="ueh-copy-data-btn" title="Sao chép tóm tắt dạng văn bản để gửi chat/tin nhắn" style="background: #F1F5F9; color: #334155; border: 1px solid #CBD5E1; padding: 8px; border-radius: 10px; font-weight: 600; font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
                        📝 Copy Tóm Tắt Tin Nhắn
                    </button>
                </div>
                <div id="ueh-sync-msg" style="font-size: 11px; text-align: center; margin-top: 6px; font-weight: 600;"></div>
            </div>
        </div>
    `;

    document.body.appendChild(hud);

    // Event: Thay đổi Checkbox điểm cho sẵn hoặc Dropdown GPA -> Load lại HUD tức thì
    document.getElementById("ueh-toggle-defaults").onchange = function () {
        localStorage.setItem("ueh_drl_inc_defaults", this.checked ? "true" : "false");
        hud.remove();
        initTracker();
    };

    document.getElementById("ueh-gpa-select").onchange = function () {
        localStorage.setItem("ueh_drl_gpa_tier", this.value);
        hud.remove();
        initTracker();
    };

    // Xử lý nút Đóng & Thu nhỏ
    document.getElementById("ueh-hud-close-btn").onclick = function () {
        hud.remove();
    };

    var isMin = false;
    document.getElementById("ueh-hud-min-btn").onclick = function () {
        var body = document.getElementById("ueh-hud-body");
        if (!isMin) {
            body.style.display = "none";
            hud.style.width = "220px";
            this.innerText = "+";
            isMin = true;
        } else {
            body.style.display = "block";
            hud.style.width = "450px";
            this.innerText = "_";
            isMin = false;
        }
    };

    // Tab switcher
    var tabBtnScores = document.getElementById("tab-btn-scores");
    var tabBtnActs = document.getElementById("tab-btn-acts");
    var tabContentScores = document.getElementById("tab-content-scores");
    var tabContentActs = document.getElementById("tab-content-acts");

    tabBtnScores.onclick = function () {
        tabBtnScores.classList.add("active");
        tabBtnActs.classList.remove("active");
        tabContentScores.style.display = "block";
        tabContentActs.style.display = "none";
    };

    tabBtnActs.onclick = function () {
        tabBtnActs.classList.add("active");
        tabBtnScores.classList.remove("active");
        tabContentScores.style.display = "none";
        tabContentActs.style.display = "block";
    };

    // 8. Cào ngầm danh sách hoạt động từ /Student/AllActivities
    var fetchedActivities = [];

    fetch("/Student/AllActivities")
        .then(function (res) { return res.text(); })
        .then(function (html) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, "text/html");
            var tableRows = doc.querySelectorAll("#activitiesTable tbody tr, table tbody tr");
            var loadingEl = document.getElementById("ueh-acts-loading");
            var listEl = document.getElementById("ueh-acts-list");
            var badgeCount = document.getElementById("act-badge-count");

            if (tableRows.length === 0) {
                if (loadingEl) loadingEl.innerHTML = "💡 Hiện chưa có hoạt động nào đang mở hoặc bạn chưa đăng nhập.";
                if (badgeCount) badgeCount.innerText = "0";
                return;
            }

            tableRows.forEach(function (tr) {
                var text = tr.innerText;
                var cells = tr.querySelectorAll("td");
                if (cells.length >= 3) {
                    var title = cells[0]?.innerText.trim() || cells[1]?.innerText.trim() || "Hoạt động";
                    var catText = text.toLowerCase();
                    var category = "TC3";

                    for (var k in tcConfig) {
                        var cfg = tcConfig[k];
                        for (var w = 0; w < cfg.keywords.length; w++) {
                            if (catText.includes(cfg.keywords[w])) {
                                category = k;
                                break;
                            }
                        }
                    }

                    var points = 2;
                    var ptMatch = text.match(/(\d+(\.\d+)?)\s*điểm/i) || text.match(/\+\s*(\d+(\.\d+)?)/);
                    if (ptMatch) points = parseFloat(ptMatch[1]);

                    var deadline = "Đang mở";
                    var dateMatch = text.match(/\d{2}\/\d{2}\/\d{4}/);
                    if (dateMatch) deadline = dateMatch[0];

                    var link = "https://drs.ueh.edu.vn/Student/AllActivities";
                    var a = tr.querySelector("a[href*='Detail'], a[href*='Register'], a.btn");
                    if (a && a.href) link = a.href;

                    var catDeficit = (tcConfig[category].max - (scores[category] || 0));
                    var priority = "⭐ Khuyến nghị";
                    var badgeStyle = "background: #EFF6FF; color: #1D4ED8;";

                    if (catDeficit <= 0) {
                        priority = "⚪ ĐÃ MAX (Không tăng tổng)";
                        badgeStyle = "background: #F1F5F9; color: #64748B;";
                    } else if (catDeficit >= 8) {
                        priority = "🔥🔥 ƯU TIÊN CAO (Bù " + catDeficit.toFixed(1) + "đ thiếu)";
                        badgeStyle = "background: #FEF2F2; color: #B91C1C;";
                    } else {
                        priority = "⭐ KHUYẾN NGHỊ (Bù " + catDeficit.toFixed(1) + "đ thiếu)";
                        badgeStyle = "background: #FEFCE8; color: #854D0E;";
                    }

                    fetchedActivities.push({
                        title: title,
                        category: category,
                        points: points,
                        deadline: deadline,
                        priority: priority,
                        badgeStyle: badgeStyle,
                        link: link,
                        deficit: catDeficit
                    });
                }
            });

            fetchedActivities.sort(function (a, b) { return b.deficit - a.deficit; });

            if (badgeCount) badgeCount.innerText = fetchedActivities.length;
            if (loadingEl) loadingEl.remove();

            if (fetchedActivities.length === 0) {
                listEl.innerHTML = `<div style="text-align:center; color:#94A3B8; padding:12px; font-size:12px;">Không có hoạt động nào đang mở.</div>`;
            } else {
                listEl.innerHTML = fetchedActivities.map(function (act) {
                    return `
                        <div class="ueh-act-card" style="background: white; border: 1px solid #E2E8F0; border-radius: 12px; padding: 10px 12px; transition: all 0.2s;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                                <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px; background: #005F691A; color: #005F69;">
                                    ${act.category}: ${tcConfig[act.category].name}
                                </span>
                                <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px; ${act.badgeStyle}">
                                    ${act.priority}
                                </span>
                            </div>
                            <div style="font-size: 12px; font-weight: 600; color: #1E293B; line-height: 1.3; margin-bottom: 6px;">
                                ${act.title}
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748B;">
                                <span>➕ <b>${act.points}đ</b> • Hạn: ${act.deadline}</span>
                                <a href="${act.link}" target="_blank" style="color: #005F69; font-weight: 700; text-decoration: none; background: #E6F4F5; padding: 3px 8px; border-radius: 6px;">
                                    Đăng ký ↗
                                </a>
                            </div>
                        </div>
                    `;
                }).join("");
            }
        })
        .catch(function (err) {
            console.error("Lỗi fetch hoạt động:", err);
            var loadingEl = document.getElementById("ueh-acts-loading");
            if (loadingEl) loadingEl.innerHTML = "⚠️ Không thể tự động đọc danh sách hoạt động.";
        });

    // 9. Xử lý Đồng bộ Google Sheet
    var syncBtn = document.getElementById("ueh-sync-sheet-btn");
    var syncMsg = document.getElementById("ueh-sync-msg");

    syncBtn.onclick = function () {
        var inputUrl = document.getElementById("ueh-webhook-input").value.trim();
        if (!inputUrl || !inputUrl.startsWith("https://script.google.com")) {
            syncMsg.style.color = "#EF4444";
            syncMsg.innerText = "⚠️ Vui lòng nhập đúng URL Google Apps Script Web App!";
            return;
        }

        localStorage.setItem("ueh_drl_webhook_url", inputUrl);
        syncBtn.disabled = true;
        syncBtn.innerHTML = "⏳ Đang gửi dữ liệu...";
        syncMsg.innerText = "";

        var payload = {
            studentName: studentName,
            studentId: studentId,
            semester: semester,
            totalScore: totalScore,
            scores: scores,
            criteriaAnalysis: criteriaAnalysis,
            defaultPoints: totalDefaultPoints,
            webPoints: totalWebActivitiesPoints,
            registeredActivities: registeredActivities,
            recommendedActivities: fetchedActivities
        };

        fetch(inputUrl, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(function () {
            syncBtn.disabled = false;
            syncBtn.innerHTML = "✅ Đồng bộ thành công!";
            syncBtn.style.background = "#10B981";
            syncMsg.style.color = "#10B981";
            syncMsg.innerText = "Dữ liệu đã được cập nhật vào Google Sheet (Listing DRL & Dashboard)!";
            setTimeout(function () {
                syncBtn.innerHTML = "🚀 Đồng bộ Google Sheet (Chuẩn Tracking DRL)";
                syncBtn.style.background = "#005F69";
            }, 3500);
        })
        .catch(function (err) {
            syncBtn.disabled = false;
            syncBtn.innerHTML = "❌ Thử lại";
            syncMsg.style.color = "#EF4444";
            syncMsg.innerText = "Lỗi khi gửi: " + err.message;
        });
    };

    // 10. Xử lý Copy Bảng Listing DRL (Khớp 100% cấu trúc Bảng Listing trong Tracking DRL.xlsx - 8 Cột)
    var copyListingBtn = document.getElementById("ueh-copy-listing-btn");
    if (copyListingBtn) {
        copyListingBtn.onclick = function () {
            if (!registeredActivities || registeredActivities.length === 0) {
                alert("Chưa tìm thấy hoạt động nào trên bảng điểm hiện tại!");
                return;
            }

            var tsvRows = [];
            tsvRows.push(["Hoạt động", "Mã hoạt động", "Mục", "Tình trạng", "Điểm", "Đóng tiền", "Link", "Note"]);

            for (var k = 0; k < registeredActivities.length; k++) {
                var act = registeredActivities[k];
                tsvRows.push([
                    act.name,
                    act.code,
                    act.criteria,
                    act.status,
                    act.points,
                    "",
                    act.link,
                    act.note
                ]);
            }

            var tsvContent = tsvRows.map(function (r) { return r.join("\t"); }).join("\n");
            navigator.clipboard.writeText(tsvContent).then(function () {
                syncMsg.style.color = "#059669";
                syncMsg.innerHTML = "✅ <b>Đã copy Bảng Listing DRL (8 cột)!</b> Mở file <i>Tracking DRL.xlsx</i> hoặc Google Sheet, chọn tab <b>Listing DRL</b> (ô A1) rồi bấm <b>Ctrl + V</b>.";
                copyListingBtn.innerHTML = "✓ Đã Copy 8 Cột!";
                setTimeout(function () {
                    copyListingBtn.innerHTML = "📋 Copy Listing DRL (8 Cột)";
                }, 3000);
            }).catch(function (err) {
                alert("Lỗi sao chép: " + err);
            });
        };
    }

    // 11. Xử lý Copy Bảng Điểm 5 Tiêu Chí (Khớp tab Đã cập nhật DRL)
    var copyTableBtn = document.getElementById("ueh-copy-table-btn");
    if (copyTableBtn) {
        copyTableBtn.onclick = function () {
            var tsvRows = [];
            tsvRows.push(["🎓 BẢNG ĐIỂM RÈN LUYỆN UEH.ISB - K50 CHUYÊN NGÀNH IBUS"]);
            tsvRows.push(["Sinh viên:", studentName, "MSSV:", studentId, "Học kỳ xét:", semester]);
            tsvRows.push(["Tổng điểm dự kiến:", totalScore.toFixed(1) + " / 100", "Xếp loại:", currentRank, "Học bổng ISB:", scholarshipStatus]);
            tsvRows.push(["Cơ cấu điểm:", "Cho sẵn: " + totalDefaultPoints.toFixed(1) + "đ", "DRS Web: " + totalWebActivitiesPoints.toFixed(1) + "đ", "GPA: " + gpaPointsMap[savedGpaTier].label]);
            tsvRows.push([]);
            tsvRows.push(["Tiêu chí", "Tên tiêu chí rèn luyện", "Điểm cho sẵn", "Điểm web DRS", "Điểm đã đạt", "Mức tối đa", "Còn thiếu", "Tiến độ", "Trạng thái"]);

            for (var i = 0; i < criteriaAnalysis.length; i++) {
                var it = criteriaAnalysis[i];
                var statusText = it.isCapped ? "ĐÃ ĐẠT MAX (KỊCH TRẦN)" : (it.diff > 0 ? "Cần thêm " + it.diff.toFixed(1) + " điểm" : "Chưa có điểm");
                tsvRows.push([
                    "TC" + it.num,
                    it.fullName,
                    it.defaultPts,
                    it.webPts,
                    it.current,
                    it.max,
                    it.diff,
                    it.percent + "%",
                    statusText
                ]);
            }

            var totalMissing = Math.max(0, 100 - totalScore);
            tsvRows.push(["TỔNG CỘNG", "Tổng điểm rèn luyện học kỳ", totalDefaultPoints.toFixed(1), totalWebActivitiesPoints.toFixed(1), totalScore.toFixed(1), "100", totalMissing.toFixed(1), Math.round((totalScore / 100) * 100) + "%", currentRank]);

            var tsvContent = tsvRows.map(function (r) { return r.join("\t"); }).join("\n");

            navigator.clipboard.writeText(tsvContent).then(function () {
                syncMsg.style.color = "#059669";
                syncMsg.innerHTML = "✅ <b>Đã copy Bảng 5 Tiêu Chí!</b> Mở Google Sheet / Excel và bấm <b>Ctrl + V</b> để dán.";
                copyTableBtn.innerHTML = "✓ Đã Copy!";
                setTimeout(function () {
                    copyTableBtn.innerHTML = "📊 Copy 5 Tiêu Chí";
                }, 3000);
            }).catch(function (err) {
                alert("Lỗi sao chép: " + err);
            });
        };
    }

    // 12. Xử lý Copy Bảng Hoạt Động Gợi Ý
    var copyActsBtn = document.getElementById("ueh-copy-acts-btn");
    if (copyActsBtn) {
        copyActsBtn.onclick = function () {
            if (!fetchedActivities || fetchedActivities.length === 0) {
                alert("Chưa có danh sách hoạt động để copy!");
                return;
            }

            var actRows = [];
            actRows.push(["🎯 DANH SÁCH HOẠT ĐỘNG KHUYẾN NGHỊ LẤY ĐIỂM (UEH.ISB K50)"]);
            actRows.push(["Mức độ ưu tiên", "Tiêu chí rèn luyện", "Tên hoạt động", "Điểm dự kiến", "Hạn chót / Tổ chức", "Đường dẫn đăng ký"]);

            for (var j = 0; j < fetchedActivities.length; j++) {
                var a = fetchedActivities[j];
                actRows.push([
                    a.priority,
                    a.category + ": " + (tcConfig[a.category]?.name || ""),
                    a.title,
                    a.points,
                    a.deadline,
                    a.link
                ]);
            }

            var actTsv = actRows.map(function (r) { return r.join("\t"); }).join("\n");
            navigator.clipboard.writeText(actTsv).then(function () {
                copyActsBtn.innerHTML = "✓ Đã Copy Bảng!";
                setTimeout(function () {
                    copyActsBtn.innerHTML = "📋 Copy Bảng Hoạt Động";
                }, 3000);
                syncMsg.style.color = "#059669";
                syncMsg.innerHTML = "✅ <b>Đã copy Bảng Hoạt Động!</b> Mở Google Sheet và nhấn <b>Cmd + V</b> để dán.";
            });
        };
    }

    // 12. Xử lý Copy tóm tắt văn bản
    document.getElementById("ueh-copy-data-btn").onclick = function () {
        var summaryText = [
            "🎓 KẾT QUẢ ĐIỂM RÈN LUYỆN UEH.ISB (K50 IBUS)",
            "-------------------------------------------",
            "👤 Sinh viên: " + studentName + " (" + studentId + ")",
            "📅 Học kỳ: " + semester,
            "🏆 Tổng điểm dự kiến: " + totalScore.toFixed(1) + " / 100 (Hạng: " + currentRank + ")",
            "💎 Bao gồm: " + totalDefaultPoints.toFixed(1) + "đ cho sẵn + " + totalWebActivitiesPoints.toFixed(1) + "đ DRS web",
            "📜 Học bổng ISB: " + scholarshipStatus,
            "",
            "📌 Chi tiết 5 Tiêu chí rèn luyện (chuẩn TrackingDRL):",
            "- TC1 (Nội quy, quy chế): " + scores.TC1 + "/25 (Cho sẵn 15đ, thiếu " + (25 - scores.TC1) + "đ)",
            "- TC2 (Học tập & GPA): " + scores.TC2 + "/20 (Cho sẵn 10đ + GPA " + currentGpaPts + "đ, thiếu " + (20 - scores.TC2) + "đ)",
            "- TC3 (Văn hóa, thể thao, ĐH Xanh): " + scores.TC3 + "/20 (Cho sẵn 5đ, thiếu " + (20 - scores.TC3) + "đ)",
            "- TC4 (Công dân & Cộng đồng): " + scores.TC4 + "/15 (Cho sẵn 10đ, thiếu " + (15 - scores.TC4) + "đ)",
            "- TC5 (Cán sự lớp & Khen thưởng): " + scores.TC5 + "/20 (Cho sẵn 10đ, thiếu " + (20 - scores.TC5) + "đ)"
        ].join("\n");

        navigator.clipboard.writeText(summaryText).then(function () {
            syncMsg.style.color = "#059669";
            syncMsg.innerText = "✅ Đã sao chép tóm tắt văn bản vào bộ nhớ tạm!";
            setTimeout(function () { syncMsg.innerText = ""; }, 3000);
        });
    };

})();
