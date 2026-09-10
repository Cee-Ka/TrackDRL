# Antigravity & Gemini Workspace Instructions: TrackDRL

Dự án này sử dụng hệ thống context và workspace rules chuẩn hóa. Khi làm việc với codebase này:

1. **Tài liệu hướng dẫn chính:** Vui lòng đọc toàn bộ tài liệu [AGENTS.md](file:///home/ceeka/Documents/TrackDRL/AGENTS.md) tại thư mục gốc.
2. **Quy tắc tính điểm rèn luyện UEH:** Xem [Rule 01](file:///home/ceeka/Documents/TrackDRL/.agents/rules/01-ueh-drl-domain.md). Bắt buộc nhớ: 54.0 điểm nền tảng có sẵn + điểm DRS, trần 5 tiêu chí (25, 20, 20, 15, 20).
3. **Cấu trúc bảng tính & Apps Script:** Xem [Rule 02](file:///home/ceeka/Documents/TrackDRL/.agents/rules/02-sheet-sync-schema.md). Bảng `Listing` 8 cột chuẩn, cơ chế Upsert không được đè mất dòng nhập tay.
4. **Ràng buộc kỹ thuật Bookmarklet:** Xem [Rule 03](file:///home/ceeka/Documents/TrackDRL/.agents/rules/03-technical-constraints.md). Firefox URL length $\le 64\text{KB}$, bắt buộc build nén qua `terser`.
5. **Bảo mật thông tin cá nhân:** Xem [Rule 04](file:///home/ceeka/Documents/TrackDRL/.agents/rules/04-privacy-security.md). Tuyệt đối cấm commit MSSV, tên sinh viên thật, hoặc dữ liệu trong thư mục `drs.ueh.edu.vn/`.
