# Rule 02: Cấu Trúc Bảng Tính Tracking DRL.xlsx & Cơ Chế Đồng Bộ Apps Script

Tài liệu này quy định cấu trúc bắt buộc của file Excel `Tracking DRL.xlsx` và hành vi đồng bộ của `google_apps_script.js` (`Code.gs`).

---

## 1. Cấu trúc Tab `Listing DRL` (Bảng `Listing`)

Tab `Listing DRL` chứa bảng dữ liệu chuẩn (Excel Table có tên `Listing`). Mọi dữ liệu xuất từ Bookmarklet hoặc đồng bộ qua Apps Script phải tuân thủ đúng thứ tự **8 cột** sau:

| STT | Tên cột | Ý nghĩa | Kiểu dữ liệu / Quy ước | Ví dụ |
| :---: | :--- | :--- | :--- | :--- |
| **1** | `Hoạt động` | Tên của sự kiện, hội thảo | Chuỗi văn bản | `Talkshow: AI in Business 2026` |
| **2** | `Mã hoạt động` | Mã định danh duy nhất (Khóa chính) | Mã số / chuỗi (Bắt buộc duy nhất) | `ACT_2026_0192` |
| **3** | `Mục` | Tiêu chí con phân bổ DRL | Chuỗi dạng số mục | `1.2.1`, `3.2.1`, `4.2.1` |
| **4** | `Tình trạng 100%` | Trạng thái hoàn thành để tính điểm | Bắt buộc là chuỗi `"100%"` | `100%` |
| **5** | `Điểm` | Số điểm DRL của hoạt động | Số thực | `1.5`, `2.0`, `3.0` |
| **6** | `Đóng tiền` | Chi phí tham gia hoạt động | Chuỗi văn bản | `Miễn phí`, `50.000đ` |
| **7** | `Link` | Đường dẫn minh chứng / sự kiện | URL | `https://drs.ueh.edu.vn/...` |
| **8** | `Note` | Ghi chú cá nhân của sinh viên | Chuỗi văn bản tùy ý | `Đã nhận cert ngày 15/03` |

---

## 2. Cấu trúc Tab `Đã cập nhật DRL` (Tự động tính điểm)

1. **Công thức SUMIFS tự động:**
   Tab này tự động tổng hợp điểm từ bảng `Listing` thông qua công thức:
   ```excel
   =SUMIFS(Listing[Điểm], Listing[Mục], A10, Listing[Tình trạng 100%], "100%")
   ```
2. **Khung Tổng hợp 5 Tiêu chí (`G1:J7`):**
   - Chứa bảng tổng điểm của từng tiêu chí (TC1 $\rightarrow$ TC5).
   - Tự động cộng 54.0 điểm nền tảng vào các mục tương ứng.
   - Áp trần tối đa cho từng tiêu chí và hiển thị kết quả xếp loại học bổng ISB.

---

## 3. Nguyên tắc Đồng bộ qua Google Apps Script (`google_apps_script.js`)

Khi chỉnh sửa backend Apps Script hoặc logic Bookmarklet trích xuất, phải tuân thủ 3 nguyên tắc bất di bất dịch:

1. **Cơ chế Upsert (Cập nhật hoặc Thêm mới) theo `Mã hoạt động`:**
   - Dùng `Mã hoạt động` (Cột 2) làm Primary Key.
   - Nếu mã đã tồn tại: Cập nhật thông tin điểm, trạng thái.
   - Nếu mã chưa có: Thêm dòng mới vào cuối bảng `Listing`.
2. **Bảo tồn hoạt động nhập tay (Offline/Manual Rows):**
   - Tuyệt đối không xóa toàn bộ sheet (`sheet.clear()` là VI PHẠM).
   - Không được ghi đè làm mất các hoạt động ngoại tuyến do sinh viên tự thêm thủ công (những dòng có mã tự đặt hoặc không có trên DRS).
3. **Bảo tồn cột `Note`:**
   - Cột 8 (`Note`) chứa ghi chú cá nhân của sinh viên. Quá trình đồng bộ tự động từ DRS không được làm trống hoặc ghi đè cột này trừ khi payload có note mới chủ động.
