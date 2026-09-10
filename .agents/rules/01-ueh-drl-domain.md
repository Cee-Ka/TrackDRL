# Rule 01: Nghiệp vụ Tính Điểm Rèn Luyện (DRL) UEH - K50 IBUS

Tài liệu này là nguồn chân lý (Single Source of Truth) về logic tính toán và quy chế điểm rèn luyện (DRL) của sinh viên UEH - ISB (đặc thù khóa K50 IBUS) được áp dụng trong dự án TrackDRL.

---

## 1. Cơ chế phân bổ điểm tổng quan

Tổng điểm DRL tối đa là **100.0 điểm**, được tính từ hai thành phần chính:
1. **Điểm nền tảng (Cho sẵn / Mặc định):** **54.0 điểm** (cố định theo quy chế sinh viên UEH).
2. **Điểm hoạt động (DRS Web):** Trích xuất từ cổng thông tin `drs.ueh.edu.vn` (talkshow, hội thảo, tình nguyện, thể thao,...).

$$\text{Tổng Điểm} = \sum_{i=1}^{5} \min\left(\text{TC}_i, \text{Trần}_i\right)$$

---

## 2. Chi tiết Điểm nền tảng (54.0 điểm)

Các mục sau đây được UEH cộng mặc định cho sinh viên đủ điều kiện (không hiển thị như một hoạt động đơn lẻ trên DRS):

| Tiêu chí | Mục | Tên nội dung | Điểm mặc định | Ghi chú |
| :---: | :---: | :--- | :---: | :--- |
| **TC1** | **1.1** | Ý thức học tập, chấp hành nội quy học tập | **15.0đ** | Mặc định sinh viên không vi phạm |
| **TC2** | **2.1** | Chấp hành nội quy, quy chế UEH | **10.0đ** | Mặc định sinh viên không vi phạm |
| **TC2** | **2.2.1**| Kết quả học tập xuất sắc/giỏi (GPA) | **4.0đ** | K50 IBUS xét GPA Giỏi |
| **TC3** | **3.1** | Ý thức và kết quả tham gia hoạt động chính trị - xã hội | **5.0đ** | Nền tảng hoạt động cộng đồng |
| **TC4** | **4.1** | Phẩm chất công dân, quan hệ cộng đồng | **10.0đ** | Mặc định lối sống tốt |
| **TC5** | **5.1** | Ý thức và kết quả tham gia công tác phụ trách lớp, đoàn thể | **10.0đ** | Mặc định sinh viên hoàn thành nhiệm vụ |
| **TỔNG**| | | **54.0đ** | **Tổng điểm khởi điểm** |

---

## 3. Trần 5 Tiêu chí (Max Caps)

Bất kể tổng điểm thô (Nền tảng + Hoạt động DRS) đạt bao nhiêu, điểm của mỗi tiêu chí bị giới hạn bởi mức trần:

| Tiêu chí | Tên tiêu chí | Trần tối đa | Điểm nền tảng có sẵn | Điểm DRS còn cần (Max) |
| :---: | :--- | :---: | :---: | :---: |
| **TC1** | Ý thức học tập | **25.0đ** | 15.0đ | Cần thêm tối đa 10.0đ |
| **TC2** | Chấp hành quy chế & GPA | **20.0đ** | 14.0đ (10.0 + 4.0) | Cần thêm tối đa 6.0đ |
| **TC3** | Hoạt động CT-XH, tình nguyện | **20.0đ** | 5.0đ | Cần thêm tối đa 15.0đ |
| **TC4** | Phẩm chất công dân, quan hệ cộng đồng | **15.0đ** | 10.0đ | Cần thêm tối đa 5.0đ |
| **TC5** | Trách nhiệm tổ chức, đoàn thể | **20.0đ** | 10.0đ | Cần thêm tối đa 10.0đ |
| **TỔNG**| | **100.0đ** | **54.0đ** | **46.0đ** |

---

## 4. Các mốc Điểm Xét Học Bổng (ISB)

Điểm rèn luyện là điều kiện tiên quyết khi xét Học bổng khuyến khích học tập tại Viện ISB / UEH:

- **Loại Xuất sắc:** $\ge 90$ điểm (Được nhân hệ số học bổng **150%**)
- **Loại Tốt:** $\ge 80$ điểm (Được nhân hệ số học bổng **120%**)
- **Loại Khá:** $\ge 65$ điểm (Được hưởng mức học bổng **100%**)
- **Dưới 65 điểm:** Không đủ điều kiện xét học bổng khuyến khích học tập.

---

## 5. Ràng buộc bóc tách từ Web DRS (`drs.ueh.edu.vn`)

1. **Chỉ tính hoạt động hoàn thành 100%:** Các hoạt động chưa duyệt hoặc không đạt 100% không được cộng vào điểm chính thức.
2. **Tránh bóc tách trùng lặp thẻ cha (Container Card Bug):**
   - Không được dùng selector chung chung như `.card` vì sẽ đếm cả container tổng bên ngoài lẫn card con bên trong, dẫn đến nhân đôi điểm.
   - Bắt buộc dùng selector lá cụ thể: `.score-group-card` hoặc truy vấn chính xác danh sách hàng hoạt động.
