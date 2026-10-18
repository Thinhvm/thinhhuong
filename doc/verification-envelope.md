# Bìa phong bì — 18/10/2026

- Thay hai cánh vòm bằng tấm thiệp chữ nhật bo 5px trong phong bì kem; không còn lớp .gate hay đường chia giữa ảnh.
- Giữ ảnh DOJ_6644_1.webp phủ tấm thiệp và lớp kem giảm độ nổi; thông tin cưới không thay đổi.
- Chạm dấu sáp: nhạc/trái tim bắt đầu ngay, nắp bật 650ms, thiệp trượt lên sau 450ms rồi mờ, nội dung mở ở 1950ms.
- Reduced motion: bỏ chuyển động và mở trực tiếp; chưa kiểm trên thiết bị thật.

## Kiểm thử
- node --check script.js đạt, máy chủ xem thử HTTP 200.
- Bìa desktop: hình chữ nhật, ảnh liền, thân phong bì/nắp/dấu sáp rõ.
- 320px: không tràn ngang; bo góc 5px; không còn .gate; ngày âm lịch nằm trên nắp (417.7 < 452.4px); nút 44px.
- 320px ở 950ms: thiệp dịch Y -62.6px, nắp quay X 175 độ; sau 2100ms nội dung mở, nhạc phát, 16 trái tim.
- 390px: không tràn ngang; ngày âm lịch trên nắp (427.2 < 471.8px); nút 54px.
- Desktop: nhấn mở lặp không tạo trùng; nội dung mở, nhạc phát, 24 trái tim trong một lớp.
- Không ghi biểu mẫu thử, không commit/push/deploy. Chưa thử trên iPhone/Android thật hay trình duyệt Zalo.

Dự phòng trước sửa: D:\CA NHAN\web.history\20261018_145726
