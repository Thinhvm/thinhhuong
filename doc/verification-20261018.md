# Cập nhật bìa và hiệu ứng — 18/10/2026

## Phạm vi
- Chỉnh index.html, theme.css, script.js trong thư mục web trên máy.
- Giữ nguyên nền kem hồng, nền hoa hai cánh, ảnh/QR/nhạc và thông tin cưới.
- Ảnh DOJ_6644_1.webp hiển thị ở bìa trước khi mở, tách khỏi chữ.
- Nạp nhạc sẵn và phát trực tiếp trong thao tác mở. Nếu phát thất bại, hiển thị gợi ý dùng nút nhạc.
- Trái tim hai hướng bắt đầu khi mở; 24 hạt desktop / 16 hạt mobile, không cản click. Tạm dừng khi tab ẩn, không tạo trùng. Tôn trọng reduced motion.

## Bằng chứng kiểm thử
- node --check script.js: đạt.
- Máy chủ xem thử loopback HTTP 200.
- Desktop: bìa giữ nền hoa, ảnh tải đúng, tên/ngày/nút rõ; sau mở cover=none, main inert=false, audio paused=false, currentTime=2.139s, error=null.
- Desktop: 12 heartFall + 12 heartRise, một lớp duy nhất; biến đổi Y lần lượt +284px và -277px chứng minh hai hướng.
- Khung 320x740 và 390x740: không tràn ngang, ảnh tải đúng; nút 56x56px nằm trong màn hình.
- Khung 390: nhấn mở hai lần chỉ có một lớp / 16 trái tim; nội dung mở; nhạc phát, nút pause/resume hoạt động.
- style.css không đổi. Hash toàn bộ image/img/music/assets khớp bản dự phòng; không thay ảnh/QR/tệp nhạc.
- Không ghi biểu mẫu thử, không commit/push/deploy.

## Giới hạn
- Kiểm tra trên trình duyệt máy và iframe kích thước mobile, chưa kiểm trên iPhone/Android thật hoặc trình duyệt trong Zalo/Facebook.
- Không mô phỏng được thiết lập reduced motion bằng trình duyệt hiện tại; nhánh CSS/JS đã kiểm tra qua mã, chưa xác minh runtime chế độ này.
- Chính sách phát nhạc của trình duyệt có thể khác; nút nhạc và thông báo lỗi được giữ làm phương án thử lại.

## Dự phòng
Bản trước chỉnh: D:\CA NHAN\web.history\20261018_144748
