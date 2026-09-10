# Rule 04: Bảo Mật Thông Tin Cá Nhân & Quản Lý Dữ Liệu (Privacy & Security)

Tài liệu này đặt ra quy định nghiêm ngặt về quyền riêng tư và an toàn thông tin của người dùng sinh viên. Mọi AI Agent và cộng tác viên phải tuân thủ 100%.

---

## 1. Nguyên tắc Không Rò Rỉ Thông Tin Cá Nhân (Zero-Leakage Policy)

Tuyệt đối KHÔNG BAO GIỜ đưa các thông tin sau vào mã nguồn, commit git, hoặc tài liệu công khai:
1. **Mã số sinh viên (MSSV)** thực tế của người dùng.
2. **Họ và tên thật**, lớp sinh hoạt, chuyên ngành cá nhân.
3. **Email sinh viên** (`@st.ueh.edu.vn`).
4. **Session Cookie, Auth Token, Bearer Header** từ các phiên đăng nhập tại `drs.ueh.edu.vn` hoặc Google Workspace.

Khi cần viết ví dụ, tài liệu hướng dẫn hoặc unit test, BẮT BUỘC dùng dữ liệu giả lập (Placeholder/Mock data):
- Tên ví dụ: `Sinh viên UEH`, `Nguyễn Văn A`.
- Mã hoạt động ví dụ: `ACT_2026_001`.
- URL ví dụ: `https://drs.ueh.edu.vn/mock/event/1`.

---

## 2. Bảo vệ Thư mục Offline Dữ liệu Thật (`drs.ueh.edu.vn/`)

- Thư mục `drs.ueh.edu.vn/` tại root là bản sao offline trang web DRS chứa dữ liệu điểm thật của người dùng để kiểm thử cục bộ.
- **Ràng buộc:**
  - Thư mục này **PHẢI LUÔN NẰM TRONG `.gitignore`**.
  - Nghiêm cấm chạy lệnh `git add -f drs.ueh.edu.vn/`.
  - Không được đưa bất kỳ file HTML/JSON thô nào từ thư mục này lên GitHub repository.

---

## 3. Danh mục Loại trừ Bắt buộc trong `.gitignore`

File [.gitignore](file:///home/ceeka/Documents/TrackDRL/.gitignore) phải luôn duy trì các mẫu loại trừ sau:
```gitignore
# Dữ liệu web offline và trích xuất điểm cá nhân
drs.ueh.edu.vn/
*.dump
*TrainingScore*
scratch/

# File tạm hệ thống & IDE
.DS_Store
Thumbs.db
*.log
.env
```

---

## 4. Checklist Kiểm tra trước khi Commit Git (Pre-Commit Privacy Check)

Trước khi thực hiện `git commit` hoặc `git push`, Agent phải tự kiểm tra:
1. Chạy `git status` để đảm bảo không có file dữ liệu cá nhân nào đang nằm trong khu vực staged.
2. Chạy `git diff --staged` để rà soát lại toàn bộ diff, đảm bảo không có chuỗi MSSV hoặc họ tên thật vô tình lọt vào code.
