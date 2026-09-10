# Rule 03: Ràng Buộc Kỹ Thuật (Technical Constraints & Build Guidelines)

Tài liệu này tổng hợp các giới hạn kỹ thuật phần cứng/trình duyệt và quy trình build bắt buộc trong dự án TrackDRL.

---

## 1. Giới hạn Bookmarklet Trình duyệt (Đặc biệt Firefox 64KB)

### Giới hạn độ dài URL
- **Firefox:** Giới hạn tối đa kích thước URL của Bookmarklet là **65,536 bytes (64KB)**. Nếu chuỗi `javascript:...` vượt quá 64KB, Firefox sẽ âm thầm từ chối kéo thả bookmarklet hoặc báo lỗi.
- **Chrome & Safari:** Cho phép kích thước lớn hơn, nhưng để đảm bảo tính đa nền tảng 100%, code bookmarklet bắt buộc phải tuân theo trần 64KB của Firefox.

### Quy trình Build & Nén bắt buộc (Build Workflow)
Bất cứ khi nào chỉnh sửa file nguồn [drl_bookmarklet.js](file:///home/ceeka/Documents/TrackDRL/drl_bookmarklet.js), Agent PHẢI thực hiện các bước sau:
1. Chạy `terser` với cấu hình nén tối đa (compress + mangle, loại bỏ comment):
   ```bash
   terser drl_bookmarklet.js -c -m --comments false -o drl_bookmarklet.min.js
   ```
2. Kiểm tra kích thước sau URL-encode:
   ```bash
   node -e '
     const fs = require("fs");
     const code = fs.readFileSync("drl_bookmarklet.min.js", "utf8");
     const url = "javascript:" + encodeURIComponent(code);
     console.log("Raw size:", code.length, "Encoded size:", url.length);
     if (url.length > 65536) {
       console.error("FATAL: Encoded bookmarklet exceeds 65536 bytes limit!");
       process.exit(1);
     } else {
       console.log("SUCCESS: Size within 64KB limit (safe for Firefox).");
     }
   '
   ```
3. Cập nhật mã `javascript:...` đã nén vào thuộc tính `href` của nút kéo thả trong cả hai file [index.html](file:///home/ceeka/Documents/TrackDRL/index.html) và [install.html](file:///home/ceeka/Documents/TrackDRL/install.html).

### Thuộc tính Kéo thả (Drag & Drop)
Thẻ `<a>` làm bookmarklet trong HTML luôn phải có thuộc tính `draggable="true"` để trình duyệt (đặc biệt là Firefox) kích hoạt event drag & drop lên Bookmark Bar.

---

## 2. Hiển thị & Copy Mã Nguồn Google Apps Script (`Code.gs`)

### Lỗi mất ký tự xuống dòng (Newline collapsing)
- Trên Firefox và một số trình duyệt, việc copy code từ thẻ `<code>` hoặc đọc qua `element.innerText` thường biến toàn bộ code thành một dòng duy nhất (`Unexpected end of input line: 1`).
- **Quy tắc giải pháp:**
  1. Thẻ hiển thị code modal bắt buộc phải là `<pre>` với CSS inline `white-space: pre !important; font-family: monospace;`.
  2. Khi gán hoặc đọc code qua JavaScript, luôn dùng `.textContent` thay vì `.innerText` hay `.innerHTML`.
  3. Luôn cung cấp nút **"Tải file Code.gs"** trực tiếp (dùng `URL.createObjectURL(new Blob([rawCode], {type: 'text/javascript'}))`) để người dùng tải file về máy và mở trong Notepad/VSCode nếu clipboard gặp sự cố.

---

## 3. Quy chuẩn Triển khai GitHub Pages

- Dự án được host static trực tiếp qua GitHub Pages từ nhánh `main`.
- Mã nguồn chạy độc lập (Vanilla JS, CSS thuần, không dùng bundler cồng kềnh như Webpack/Vite trừ `terser` cho bookmarklet).
- Giữ [index.html](file:///home/ceeka/Documents/TrackDRL/index.html) và [install.html](file:///home/ceeka/Documents/TrackDRL/install.html) đồng bộ về phiên bản mã bookmarklet và code Google Apps Script.
