# 🎓 HỆ THỐNG THEO DÕI ĐIỂM RÈN LUYỆN TỰ ĐỘNG UEH.ISB (K50 IBUS)

> **Giải pháp chuyên biệt cho sinh viên Khóa 50 Chuyên ngành Kinh doanh Quốc tế (IBUS) - Viện Đào tạo Quốc tế (ISB) - Trường Đại học Kinh tế TP. Hồ Chí Minh (UEH).**  
> *Cập nhật phiên bản v3.5: Khớp 100% Tracking DRL.xlsx, tích hợp Điểm cho sẵn nền tảng & Quy chế mới UEH 2026.*

---

## 📌 Các Tính Năng Nổi Bật (Phiên bản v3.5)

1. **Tự Động Tích Hợp Điểm Cho Sẵn Nền Tảng (Base 54.0đ):**
   * Trong quy chế UEH, nhiều mục điểm rèn luyện là **điểm mặc định (cho sẵn)** được nhà trường công nhận nhưng **không hiện trên cổng DRS** trong học kỳ (như trong file `Tracking DRL.xlsx` các ô xanh dương):
     * **Mục 1.1:** Ý thức và kết quả chấp hành nội quy = **15.0đ** (TC1)
     * **Mục 2.1:** Ý thức và thái độ trong học tập = **10.0đ** (TC2)
     * **Mục 2.2.1:** Kết quả học tập GPA = **4.0đ** (Mặc định cho học lực Giỏi/Tốt, có thể tùy chỉnh) (TC2)
     * **Mục 3.1:** Ý thức và kết quả tham gia hoạt động rèn luyện = **5.0đ** (TC3)
     * **Mục 4.1:** Ý thức công dân trong quan hệ cộng đồng = **10.0đ** (TC4)
     * **Mục 5.1:** Tinh thần trách nhiệm, ý thức tham gia tập thể lớp = **10.0đ** (TC5)
     * **Tổng điểm cho sẵn cơ sở:** **54.0 điểm**.
   * Tool tự động cộng dồn điểm nền tảng này với các hoạt động bạn tham gia trên cổng DRS (hiện tại là 4.5đ) để ra **tổng điểm dự kiến chính xác 100%: 58.5 / 100đ**!
   * Có nút Toggle bật/tắt điểm cho sẵn và menu dropdown chọn mức GPA (Xuất sắc +5đ, Giỏi +4đ, Khá +3đ, TB +2đ).

2. **Theo dõi Điểm Tức Thời & Đối chiếu Học bổng Viện ISB:**
   * Tự động quét điểm và đối chiếu trực tiếp với 3 ngưỡng học bổng Viện ISB:
     * 🌟 **Học bổng Xuất sắc (150% suất):** Điểm rèn luyện $\ge 90$ điểm.
     * ⭐ **Học bổng Giỏi (120% suất):** Điểm rèn luyện $\ge 80$ điểm.
     *  **Học bổng Khá (100% suất):** Điểm rèn luyện $\ge 65$ điểm.
   * **Khoảng cách hiện tại của bạn:** Đang đạt **58.5đ**, chỉ còn thiếu đúng **6.5 điểm** là chạm ngưỡng Học bổng Khá ISB (chỉ cần tham gia thêm 2-3 hoạt động)!

3. **Phân Rã 5 Nhóm Tiêu Chí Chuẩn UEH (TC1 đến TC5 - Khớp 100% Tracking DRL.xlsx):**
   * **TC1 (Max 25đ):** Đánh giá trách nhiệm chấp hành pháp luật và nội quy, quy chế UEH.
   * **TC2 (Max 20đ):** Trách nhiệm, tinh thần và thái độ trong học tập tại UEH.
   * **TC3 (Max 20đ):** Hoạt động chính trị, văn hóa, thể thao, phát triển bền vững & Đại học Xanh.
   * **TC4 (Max 15đ):** Đánh giá về ý thức công dân trong quan hệ cộng đồng.
   * **TC5 (Max 20đ):** Cán sự lớp, đoàn thể, tổ chức & Thành tích khen thưởng, NCKH, thi đua.
   * ⚠️ **Cảnh báo Kịch trần (Cap):** Cảnh báo ngay những tiêu chí đã đủ điểm tối đa để tránh lãng phí thời gian tham gia các sự kiện không cộng thêm điểm.

4. **Smart Activity Matcher (Gợi ý hoạt động thông minh):**
   * Tự động quét các hoạt động đang mở đăng ký tại cổng DRS (`/Student/AllActivities`).
   * Phân loại mức độ ưu tiên theo đúng tiêu chí mà bạn đang thiếu:
     * 🔥🔥 **Ưu tiên Cao:** Hoạt động bù đắp cho tiêu chí bạn đang thiếu nhiều điểm nhất.
     * ⭐ **Khuyến nghị:** Hoạt động bù điểm cho các tiêu chí còn lại.
     * ⚪ **Đã Max:** Cảnh báo tiêu chí đã đạt điểm tối đa.
   * Cung cấp nút đăng ký trực tiếp và nút sao chép toàn bộ danh sách sự kiện ra bảng tính.

5. **2 Lựa Chọn Xuất & Đồng Bộ Dữ Liệu Tiện Lợi:**
   * **Cách A (Nhanh nhất - 1 Click Copy):** Bấm nút **Copy Bảng Điểm** trên tool, sau đó mở Google Sheet hoặc Excel, click ô **A1** và nhấn **`Cmd + V`**. Toàn bộ bảng điểm 9 cột (Điểm cho sẵn, Điểm web DRS, Điểm tổng, Cần thiếu, Trạng thái) sẽ hiện ra ngay lập tức!
   * **Cách B (Đồng bộ tự động qua Webhook):** Cung cấp mã Google Apps Script để tự động cập nhật Dashboard Google Sheet đẹp mắt và lưu trữ lịch sử cập nhật.

6. **Hoàn Toàn Thân Thiện Với Non-Tech & Tương Thích 100% macOS:**
   * Hoạt động mượt mà trên cả **Safari** và **Google Chrome** trên máy Mac.
   * Không cần cài đặt Node.js hay phần mềm phức tạp, chỉ cần kéo thả nút Bookmarklet.
   * An toàn tuyệt đối: Chạy cục bộ trên trình duyệt, không lưu trữ thông tin cá nhân ra ngoài.

---

## 🚀 Hướng Dẫn Cài Đặt (Chỉ mất 1 - 2 phút)

### Bước 1: Mở trang cài đặt trực quan
1. Mở file [install.html](file:///home/ceeka/Documents/TrackDRL/install.html) trên máy Mac của bạn bằng trình duyệt Chrome hoặc Safari:
   * Mở Terminal gõ: `open /home/ceeka/Documents/TrackDRL/install.html` (hoặc nhấp đúp vào file `install.html` trong Finder).
2. Bật thanh Dấu trang (Bookmark Bar) trên Mac:
   * **Chrome / Safari:** Bấm tổ hợp phím `Cmd + Shift + B`.
3. Nhấn giữ và kéo nút màu xanh **🎯 Track DRL UEH-ISB (K50)** thả lên thanh Bookmark.

---

### Bước 2 (Tùy chọn): Thiết lập Google Sheet Tự Động Đồng Bộ (Nếu muốn dùng Cách B)

1. Truy cập [sheets.new](https://sheets.new) để tạo 1 file Google Sheet mới.
2. Trên menu Google Sheet, chọn: **Tiện ích mở rộng (Extensions)** ➔ **Apps Script**.
3. Xóa hết code mặc định, copy toàn bộ nội dung từ file [google_apps_script.js](file:///home/ceeka/Documents/TrackDRL/google_apps_script.js) (hoặc bấm nút copy trong `install.html`) và dán vào.
4. Bấm **Lưu (Save)** (`Cmd + S`).
5. Bấm nút **Triển khai (Deploy)** ở góc trên bên phải ➔ **Triển khai dưới dạng ứng dụng web (New deployment)**:
   * **Mô tả:** `DRL K50 Sync v3.5`
   * **Ai có quyền truy cập (Who has access):** Chọn **Bất kỳ ai (Anyone)**.
6. Bấm **Triển khai (Deploy)** ➔ Cấp quyền xác thực Google ➔ **Sao chép URL ứng dụng web (Web app URL)** (dạng `https://script.google.com/macros/s/.../exec`).

---

## 💡 Cách Sử Dụng Hằng Ngày

1. Mở Safari hoặc Chrome trên máy Mac, truy cập vào cổng: **[drs.ueh.edu.vn/Student/TrainingScore](https://drs.ueh.edu.vn/Student/TrainingScore)**.
2. Đăng nhập bằng tài khoản sinh viên UEH.
3. Bấm vào nút Bookmark **🎯 Track DRL UEH-ISB (K50)** trên thanh Dấu trang.
4. Cửa sổ phân tích (HUD) sẽ xuất hiện ngay lập tức:
   * **Tổng điểm:** Xem ngay tổng điểm đã cộng điểm nền tảng (54.0đ) + DRS (4.5đ) = **58.5đ**.
   * **Khoảng cách học bổng:** Thấy rõ bạn chỉ cần thêm **6.5 điểm** để đạt mốc Học bổng Khá ISB ($\ge 65$đ).
   * **5 Tiêu chí:** Xem từng tiêu chí TC1 đến TC5, điểm cho sẵn và điểm đã tích lũy trên web.
   * **Gợi ý sự kiện:** Chuyển sang tab **Hoạt Động Gợi Ý** để chọn đăng ký các sự kiện đang mở nhằm lấy đủ 6.5 điểm còn thiếu.
   * **Lưu bảng điểm:** Bấm **📊 Copy Bảng Điểm** để dán vào Excel/Google Sheet, hoặc dán URL Web App vào ô Webhook và bấm **🚀 Đồng bộ tự động**.

---

## 📁 Danh Mục Tệp Trong Thư Mục Dự Án

* [install.html](file:///home/ceeka/Documents/TrackDRL/install.html): Giao diện cài đặt kéo-thả Bookmarklet trực quan cho macOS.
* [drl_bookmarklet.js](file:///home/ceeka/Documents/TrackDRL/drl_bookmarklet.js): Mã nguồn JavaScript của Bookmarklet HUD (v3.5).
* [google_apps_script.js](file:///home/ceeka/Documents/TrackDRL/google_apps_script.js): Mã nguồn Google Apps Script đồng bộ Sheet 9 cột (v3.5).
* [Tracking DRL.xlsx](file:///home/ceeka/Documents/TrackDRL/Tracking%20DRL.xlsx): Bảng dữ liệu chuẩn của UEH & K50 IBUS.
* [README.md](file:///home/ceeka/Documents/TrackDRL/README.md): Hướng dẫn sử dụng chi tiết.
