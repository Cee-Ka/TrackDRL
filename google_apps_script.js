/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT: HỆ THỐNG THEO DÕI ĐIỂM RÈN LUYỆN UEH - ISB (K50 IBUS)
 * ==============================================================================
 * Phiên bản: 3.5 (Cập nhật khớp 100% Tracking DRL.xlsx & Quy chế mới UEH 2026)
 * Cơ chế phân bổ điểm:
 *  - Điểm cho sẵn (Nền tảng): 54.0đ (1.1: 15đ, 2.1: 10đ, 2.2.1 GPA Giỏi: 4đ, 3.1: 5đ, 4.1: 10đ, 5.1: 10đ)
 *  - Điểm hoạt động (DRS Web): Talkshow, hội thảo, thể thao, tình nguyện, v.v.
 *  - 5 Tiêu chí: TC1 (25đ), TC2 (20đ), TC3 (20đ), TC4 (15đ), TC5 (20đ) -> Tổng 100đ
 * ==============================================================================
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Đồng bộ trực tiếp vào Tab 'Listing DRL' (Khớp 100% bảng Tracking DRL.xlsx)
    syncListingDrlSheet(ss, data.registeredActivities || []);

    // 2. Cập nhật Tab Tổng quan Dashboard
    updateDashboardSheet(ss, data);

    // 3. Cập nhật Tab Hoạt Động Gợi Ý
    updateActivitiesSheet(ss, data.recommendedActivities || []);

    // 4. Ghi lịch sử đồng bộ
    logSyncHistory(ss, data);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Đồng bộ thành công dữ liệu ĐRL chuẩn Tracking DRL.xlsx (Listing DRL & 5 Tiêu chí)!",
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("UEH-ISB DRL Sync Web App (v3.5) đang hoạt động bình thường! Dùng Bookmarklet trên drs.ueh.edu.vn để đẩy dữ liệu.");
}

/**
 * Đồng bộ danh sách hoạt động trực tiếp vào Tab 'Listing DRL'
 * Khớp 100% cấu trúc Bảng 'Listing' trong file 'Tracking DRL.xlsx' (8 cột chuẩn):
 * [A] Hoạt động | [B] Mã hoạt động | [C] Mục | [D] Tình trạng | [E] Điểm | [F] Đóng tiền | [G] Link | [H] Note
 */
function syncListingDrlSheet(ss, registeredActivities) {
  var sheetName = "Listing DRL";
  var sheet = ss.getSheetByName(sheetName);
  var uehTeal = "#005F69";

  var headers = ["Hoạt động", "Mã hoạt động", "Mục", "Tình trạng", "Điểm", "Đóng tiền", "Link", "Note"];

  if (!sheet) {
    // Nếu chưa có tab Listing DRL (ví dụ người dùng mở Google Sheet mới)
    sheet = ss.insertSheet(sheetName, 0);
    sheet.getRange("A1:H1").setValues([headers])
      .setFontWeight("bold")
      .setBackground(uehTeal)
      .setFontColor("#FFFFFF")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");
    sheet.setRowHeight(1, 36);
    sheet.setFrozenRows(1);
  }

  if (!registeredActivities || registeredActivities.length === 0) {
    return;
  }

  var lastRow = sheet.getLastRow();
  var codeMap = {};
  var nameMap = {};

  if (lastRow >= 2) {
    var numCols = Math.max(8, sheet.getLastColumn());
    var existingValues = sheet.getRange(2, 1, lastRow - 1, numCols).getValues();
    for (var r = 0; r < existingValues.length; r++) {
      var rowIdx = r + 2;
      var actName = (existingValues[r][0] || "").toString().trim();
      var actCode = (existingValues[r][1] || "").toString().trim();
      if (actCode) {
        codeMap[actCode] = rowIdx;
      }
      if (actName) {
        nameMap[actName.toLowerCase()] = rowIdx;
      }
    }
  }

  for (var i = 0; i < registeredActivities.length; i++) {
    var act = registeredActivities[i];
    if (!act.name && !act.code) continue;

    var targetRow = null;
    if (act.code && codeMap[act.code]) {
      targetRow = codeMap[act.code];
    } else if (act.name && nameMap[act.name.toLowerCase()]) {
      targetRow = nameMap[act.name.toLowerCase()];
    }

    if (targetRow) {
      // Đã có trong Sheet: Cập nhật mã mục, tình trạng 100%, điểm DRS
      if (act.criteria) sheet.getRange(targetRow, 3).setValue(act.criteria);
      
      var statusVal = (act.status === "100%" || act.points > 0) ? 1 : 0.5;
      sheet.getRange(targetRow, 4).setValue(statusVal).setNumberFormat("0%").setHorizontalAlignment("center");
      sheet.getRange(targetRow, 5).setValue(act.points).setNumberFormat("0.0").setHorizontalAlignment("center");

      // Giữ nguyên cột Đóng tiền (F), chỉ điền Link/Note nếu ô hiện tại đang trống
      var currentLink = sheet.getRange(targetRow, 7).getValue();
      if (!currentLink && act.link) {
        sheet.getRange(targetRow, 7).setValue(act.link);
      }
      var currentNote = sheet.getRange(targetRow, 8).getValue();
      if (!currentNote && act.note) {
        sheet.getRange(targetRow, 8).setValue(act.note);
      }
    } else {
      // Hoạt động mới từ DRS: Thêm dòng mới vào cuối bảng Listing DRL
      var newStatus = (act.status === "100%" || act.points > 0) ? 1 : 0.5;
      var newRow = [
        act.name,
        act.code || "",
        act.criteria || "",
        newStatus,
        act.points || 0,
        "", // Đóng tiền
        act.link || "",
        act.note || "Đồng bộ từ DRS"
      ];
      sheet.appendRow(newRow);
      var newRowIdx = sheet.getLastRow();

      sheet.getRange(newRowIdx, 1).setHorizontalAlignment("left");
      sheet.getRange(newRowIdx, 2).setHorizontalAlignment("center");
      sheet.getRange(newRowIdx, 3).setHorizontalAlignment("center");
      sheet.getRange(newRowIdx, 4).setNumberFormat("0%").setHorizontalAlignment("center");
      sheet.getRange(newRowIdx, 5).setNumberFormat("0.0").setHorizontalAlignment("center");
      sheet.getRange(newRowIdx, 6).setHorizontalAlignment("center");
      sheet.getRange(newRowIdx, 7).setHorizontalAlignment("left");
      sheet.getRange(newRowIdx, 8).setHorizontalAlignment("left");
    }
  }

  // Tối ưu độ rộng các cột chuẩn
  sheet.setColumnWidth(1, 380); // Tên hoạt động
  sheet.setColumnWidth(2, 220); // Mã hoạt động
  sheet.setColumnWidth(3, 90);  // Mục
  sheet.setColumnWidth(4, 90);  // Tình trạng
  sheet.setColumnWidth(5, 70);  // Điểm
  sheet.setColumnWidth(6, 90);  // Đóng tiền
  sheet.setColumnWidth(7, 240); // Link
  sheet.setColumnWidth(8, 200); // Note
}

/**
 * Cập nhật Tab Tổng quan & Thống kê điểm 5 Tiêu chí chuẩn theo Tracking DRL.xlsx
 */
function updateDashboardSheet(ss, data) {
  var sheetName = "📊 Tổng quan K50 IBUS";
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName, 0);
  }
  sheet.clear();
  sheet.setGridlines(true);

  // Palette màu chuẩn UEH & Tracking Sheet
  var uehTeal = "#005F69";
  var uehLightTeal = "#E6F4F5";
  var textDark = "#1E293B";
  var borderGray = "#CBD5E1";
  var blueDefaultBg = "#E0F2FE"; // Màu xanh nhạt đại diện điểm cho sẵn

  // Tiêu đề Dashboard
  sheet.getRange("A1:I1").merge()
    .setValue("🎓 BẢNG THEO DÕI ĐIỂM RÈN LUYỆN UEH.ISB - K50 CHUYÊN NGÀNH IBUS")
    .setFontSize(14)
    .setFontWeight("bold")
    .setFontColor("#FFFFFF")
    .setBackground(uehTeal)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(1, 42);

  // Thẻ thông tin sinh viên (Cột A -> D)
  sheet.getRange("A3:D3").merge().setValue("👤 THÔNG TIN SINH VIÊN:").setFontWeight("bold").setFontColor(uehTeal);
  sheet.getRange("A4").setValue("Họ và Tên:").setFontWeight("bold");
  sheet.getRange("B4:D4").merge().setValue(data.studentName || "Sinh viên K50 ISB-IBUS");
  sheet.getRange("A5").setValue("Mã số SV:").setFontWeight("bold");
  sheet.getRange("B5:D5").merge().setValue(data.studentId || "Chưa xác định");
  sheet.getRange("A6").setValue("Học kỳ xét:").setFontWeight("bold");
  sheet.getRange("B6:D6").merge().setValue(data.semester || "Học kỳ hiện tại");
  sheet.getRange("A7").setValue("Cập nhật lúc:").setFontWeight("bold");
  sheet.getRange("B7:D7").merge().setValue(Utilities.formatDate(new Date(), "GMT+7", "HH:mm:ss dd/MM/yyyy"));

  // Thẻ Tổng điểm & Đánh giá xếp loại ISB (Cột F -> I)
  var totalScore = Number(data.totalScore || 0);
  var rank = "Chưa xếp loại";
  var scholarshipMsg = "Chưa đạt ngưỡng học bổng";
  var cardBg = "#F1F5F9";

  if (totalScore >= 90) {
    rank = "XUẤT SẮC (≥ 90)";
    scholarshipMsg = "🌟 Đủ điều kiện xét Học bổng Xuất sắc ISB (150% toàn phần)";
    cardBg = "#ECFDF5";
  } else if (totalScore >= 80) {
    rank = "TỐT (80 - 89)";
    scholarshipMsg = "⭐ Đủ điều kiện xét Học bổng Giỏi ISB (120% toàn phần)";
    cardBg = "#EFF6FF";
  } else if (totalScore >= 65) {
    rank = "KHÁ (65 - 79)";
    scholarshipMsg = " Đủ điều kiện xét Học bổng Khá ISB (100% toàn phần)";
    cardBg = "#FEFCE8";
  } else if (totalScore >= 50) {
    rank = "TRUNG BÌNH (50 - 64)";
    var gap = (65 - totalScore).toFixed(1);
    scholarshipMsg = "⚠️ Cần tích lũy thêm tối thiểu " + gap + "đ để đạt ngưỡng xét học bổng Khá!";
    cardBg = "#FFF7ED";
  } else {
    rank = "YẾU / KÉM (< 50)";
    scholarshipMsg = " Cảnh báo: Nguy cơ không đủ điều kiện rèn luyện!";
    cardBg = "#FEF2F2";
  }

  sheet.getRange("F3:I3").merge().setValue("🏆 KẾT QUẢ ĐIỂM RÈN LUYỆN DỰ KIẾN").setFontWeight("bold").setFontColor(uehTeal).setHorizontalAlignment("center");
  sheet.getRange("F4:I5").merge()
    .setValue(totalScore.toFixed(1) + " / 100")
    .setFontSize(22)
    .setFontWeight("bold")
    .setFontColor(uehTeal)
    .setBackground(cardBg)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  
  sheet.getRange("F6:I6").merge()
    .setValue("Xếp loại: " + rank)
    .setFontWeight("bold")
    .setBackground(cardBg)
    .setHorizontalAlignment("center");

  sheet.getRange("F7:I7").merge()
    .setValue(scholarshipMsg)
    .setFontSize(9)
    .setFontColor("#475569")
    .setBackground(cardBg)
    .setHorizontalAlignment("center");

  // Bảng phân rã 5 Tiêu chí chuẩn theo TrackingDRL.xlsx
  sheet.getRange("A9:I9").merge()
    .setValue("📌 BẢNG CHI TIẾT 5 TIÊU CHÍ ĐIỂM RÈN LUYỆN (KHỚP 100% TRACKING DRL)")
    .setFontWeight("bold")
    .setFontColor(uehTeal);

  var headers = [
    "Tiêu chí", 
    "Tên tiêu chí rèn luyện", 
    "Điểm cho sẵn (Nền tảng)", 
    "Điểm hoạt động (DRS Web)", 
    "Điểm đã đạt", 
    "Mức tối đa", 
    "Còn thiếu", 
    "Tiến độ", 
    "Trạng thái"
  ];
  sheet.getRange("A10:I10").setValues([headers])
    .setFontWeight("bold")
    .setBackground(uehLightTeal)
    .setFontColor(textDark)
    .setHorizontalAlignment("center");

  var tcConfig = [
    { num: 1, code: "TC1", name: "Chấp hành pháp luật, nội quy, quy chế UEH", defaultPts: 15, max: 25 },
    { num: 2, code: "TC2", name: "Thái độ và trách nhiệm trong học tập", defaultPts: 14, max: 20 },
    { num: 3, code: "TC3", name: "Hoạt động chính trị, văn thể mỹ & ĐH Xanh", defaultPts: 5, max: 20 },
    { num: 4, code: "TC4", name: "Ý thức công dân trong quan hệ cộng đồng", defaultPts: 10, max: 15 },
    { num: 5, code: "TC5", name: "Cán sự lớp, đoàn thể & Thành tích thi đua", defaultPts: 10, max: 20 }
  ];

  var analysisList = data.criteriaAnalysis || [];
  var analysisMap = {};
  for (var a = 0; a < analysisList.length; a++) {
    analysisMap[analysisList[a].code] = analysisList[a];
  }

  var scoresMap = data.scores || {};
  var rows = [];

  for (var i = 0; i < tcConfig.length; i++) {
    var c = tcConfig[i];
    var item = analysisMap[c.code];
    var defPts = item ? Number(item.defaultPts || 0) : c.defaultPts;
    var webPts = item ? Number(item.webPts || 0) : Number(scoresMap[c.code] || 0);
    var current = item ? Number(item.current || 0) : Math.min(c.max, defPts + webPts);
    var missing = Math.max(0, c.max - current);
    var percent = (current / c.max);
    var status = "Đang thiếu";

    if (current >= c.max) {
      status = " ĐÃ ĐẠT MAX (KỊCH TRẦN)";
    } else if (current > 0) {
      status = "⚡ Cần thêm " + missing.toFixed(1) + " điểm";
    } else {
      status = " Chưa có điểm";
    }

    rows.push([
      "TC" + c.num,
      c.name,
      defPts,
      webPts,
      current,
      c.max,
      missing,
      percent,
      status
    ]);
  }

  sheet.getRange(11, 1, rows.length, 9).setValues(rows);

  // Format cột
  sheet.getRange("A11:A15").setHorizontalAlignment("center").setFontWeight("bold");
  sheet.getRange("C11:C15").setHorizontalAlignment("center").setBackground(blueDefaultBg);
  sheet.getRange("D11:D15").setHorizontalAlignment("center");
  sheet.getRange("E11:G15").setHorizontalAlignment("center").setFontWeight("bold");
  sheet.getRange("H11:H15").setNumberFormat("0.0%").setHorizontalAlignment("center");
  sheet.getRange("I11:I15").setHorizontalAlignment("left");

  // Format hàng tổng kết (Hàng 16)
  var totalRowIndex = 16;
  sheet.getRange(totalRowIndex, 1).setValue("TỔNG CỘNG").setFontWeight("bold").setHorizontalAlignment("center");
  sheet.getRange(totalRowIndex, 2).setValue("Tổng điểm rèn luyện dự kiến").setFontWeight("bold");
  sheet.getRange(totalRowIndex, 3).setFormula("=SUM(C11:C15)").setFontWeight("bold").setHorizontalAlignment("center").setBackground(blueDefaultBg);
  sheet.getRange(totalRowIndex, 4).setFormula("=SUM(D11:D15)").setFontWeight("bold").setHorizontalAlignment("center");
  sheet.getRange(totalRowIndex, 5).setFormula("=SUM(E11:E15)").setFontWeight("bold").setHorizontalAlignment("center");
  sheet.getRange(totalRowIndex, 6).setValue(100).setFontWeight("bold").setHorizontalAlignment("center");
  sheet.getRange(totalRowIndex, 7).setFormula("=F16-E16").setFontWeight("bold").setHorizontalAlignment("center");
  sheet.getRange(totalRowIndex, 8).setFormula("=E16/F16").setNumberFormat("0.0%").setFontWeight("bold").setHorizontalAlignment("center");
  sheet.getRange(totalRowIndex, 9).setValue(rank).setFontWeight("bold");
  sheet.getRange("A16:I16").setBackground("#F1F5F9");

  // Border & Column width
  sheet.getRange("A10:I16").setBorder(true, true, true, true, true, true, borderGray, SpreadsheetApp.BorderStyle.SOLID);
  sheet.autoResizeColumn(1);
  sheet.setColumnWidth(2, 330);
  sheet.autoResizeColumn(3);
  sheet.autoResizeColumn(4);
  sheet.autoResizeColumn(5);
  sheet.autoResizeColumn(6);
  sheet.autoResizeColumn(7);
  sheet.autoResizeColumn(8);
  sheet.setColumnWidth(9, 260);
}

/**
 * Cập nhật Tab Gợi ý Hoạt động theo 5 Tiêu chí
 */
function updateActivitiesSheet(ss, activities) {
  var sheetName = "🎯 Hoạt Động Gợi Ý";
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName, 1);
  }
  sheet.clear();
  sheet.setGridlines(true);

  var uehTeal = "#005F69";
  var uehLightTeal = "#E6F4F5";
  var textDark = "#1E293B";
  var borderGray = "#CBD5E1";

  // Tiêu đề
  sheet.getRange("A1:G1").merge()
    .setValue("🎯 DANH SÁCH HOẠT ĐỘNG KHUYẾN NGHỊ LẤY ĐIỂM (UEH.ISB K50)")
    .setFontSize(13)
    .setFontWeight("bold")
    .setFontColor("#FFFFFF")
    .setBackground(uehTeal)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(1, 38);

  sheet.getRange("A2:G2").merge()
    .setValue("💡 Danh sách hoạt động đang mở được sắp xếp ưu tiên theo đúng tiêu chí mà bạn đang thiếu điểm.")
    .setFontSize(9)
    .setFontStyle("italic")
    .setFontColor("#64748B");

  var headers = ["Mức độ ưu tiên", "Tiêu chí rèn luyện", "Tên hoạt động", "Điểm dự kiến", "Hạn đăng ký / Tổ chức", "Trạng thái", "Đường dẫn đăng ký"];
  sheet.getRange("A4:G4").setValues([headers])
    .setFontWeight("bold")
    .setBackground(uehLightTeal)
    .setFontColor(textDark)
    .setHorizontalAlignment("center");

  if (!activities || activities.length === 0) {
    sheet.getRange("A5:G5").merge()
      .setValue("Hiện chưa tìm thấy hoạt động đang mở hoặc hệ thống DRS đang trong giai đoạn cập nhật.")
      .setHorizontalAlignment("center")
      .setFontColor("#94A3B8");
    return;
  }

  var rows = [];
  for (var i = 0; i < activities.length; i++) {
    var act = activities[i];
    rows.push([
      act.priority || "⭐ Khuyến nghị",
      act.category || "TC",
      act.title || "Không rõ tên",
      act.points || 0,
      act.deadline || "Xem chi tiết",
      "Đang mở",
      act.link || "https://drs.ueh.edu.vn/Student/AllActivities"
    ]);
  }

  sheet.getRange(5, 1, rows.length, 7).setValues(rows);

  // Định dạng
  sheet.getRange(5, 1, rows.length, 2).setHorizontalAlignment("center").setFontWeight("bold");
  sheet.getRange(5, 4, rows.length, 1).setHorizontalAlignment("center");
  sheet.getRange(5, 5, rows.length, 2).setHorizontalAlignment("center");

  sheet.getRange(4, 1, rows.length + 1, 7).setBorder(true, true, true, true, true, true, borderGray, SpreadsheetApp.BorderStyle.SOLID);
  sheet.autoResizeColumn(1);
  sheet.autoResizeColumn(2);
  sheet.setColumnWidth(3, 340);
  sheet.autoResizeColumn(4);
  sheet.autoResizeColumn(5);
  sheet.autoResizeColumn(6);
  sheet.setColumnWidth(7, 280);
}

/**
 * Ghi lại lịch sử cập nhật điểm
 */
function logSyncHistory(ss, data) {
  var sheetName = "🕒 Lịch Sử Đồng Bộ";
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName, 2);
    var headers = [
      "Thời gian đồng bộ", 
      "Học kỳ", 
      "Tổng điểm ĐRL", 
      "Điểm cho sẵn", 
      "Điểm DRS", 
      "Điểm TC1", 
      "Điểm TC2", 
      "Điểm TC3", 
      "Điểm TC4", 
      "Điểm TC5", 
      "Xếp loại"
    ];
    sheet.getRange("A1:K1").setValues([headers])
      .setFontWeight("bold")
      .setBackground("#005F69")
      .setFontColor("#FFFFFF")
      .setHorizontalAlignment("center");
    sheet.autoResizeColumns(1, 11);
  }

  var scores = data.scores || {};
  var totalScore = Number(data.totalScore || 0);
  var defPts = Number(data.defaultPoints || 0);
  var webPts = Number(data.webPoints || 0);
  var rank = totalScore >= 90 ? "Xuất sắc" : totalScore >= 80 ? "Tốt" : totalScore >= 65 ? "Khá" : totalScore >= 50 ? "Trung bình" : "Yếu/Kém";

  var row = [
    Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss"),
    data.semester || "Kỳ hiện tại",
    totalScore,
    defPts,
    webPts,
    scores.TC1 || 0,
    scores.TC2 || 0,
    scores.TC3 || 0,
    scores.TC4 || 0,
    scores.TC5 || 0,
    rank
  ];

  sheet.appendRow(row);
  var lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, 11).setHorizontalAlignment("center");
}
