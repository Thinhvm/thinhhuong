# Kết quả kiểm thử thiệp cưới — 11/10/2026

## Giao diện và trải nghiệm
Bìa kem hồng với hoa màu nước, viền champagne, tên riêng khỏi ảnh. Hai cánh quay ngược hướng quanh trục Y; đo trạng thái giữa hiệu ứng có matrix3d đối xứng và opacity chân dung ~0.60. Sau mở, bìa biến mất và focus đến invitationHeading. Guard bấm lặp hoạt động. Desktop screenshot 960×894 và khung mobile thực 390×844 đã được xem; không tràn ngang ở 320/390/960. Lưu ý đây là iframe viewport, không phải iPhone/Android vật lý.

## Kiểm thử chức năng
- node --check script.js: đạt.
- git diff --check: đạt (chỉ cảnh báo Git đổi LF/CRLF theo cấu hình máy).
- Một DOMContentLoaded và một wish submit listener; không còn defaultWishes.
- Toàn bộ đường dẫn tài nguyên local kiểm tra tồn tại.
- Album next/prev thay index1 rồi0; lightbox mở, focus nút đóng, Escape.
- Gift/RSVP mở có focus bên trong, Escape đóng và giải phóng khóa.
- Nhạc phát thực, aria-pressed true; pause thực. Không giả lập thành công nếu play lỗi.
- QR hai ảnh tải được, src gốc giữ nguyên.
- Reduced-motion nhánh mở trực tiếp, inert false và focus đúng.
- Mock bộ lưu trong trình duyệt: hai submit liên tiếp chỉ một add; thành công mở lại nút; lỗi giữ nguyên nội dung và báo lỗi. Không gửi wish/RSVP thử vào Firebase thật.
- Sổ lời chúc thật tải được bằng read-only; không kiểm chứng chính sách ghi hoặc khả năng chống spam ở máy chủ.

## Bảo toàn dữ liệu
Tên gia đình, hai số tài khoản, hạn RSVP25/10/2026, giờ10:30/11:00 kiểm tra đối chiếu snapshot: giữ nguyên. Ảnh, QR, music không sửa. Bản đồ và thông tin âm lịch giữ nguyên từ nguồn, chưa xác minh độc lập.

## Rà soát thiết kế / kỹ thuật
Không có lỗi chặn trong các luồng đã thử. Hướng hoa giấy và ảnh vòm thống nhất; chữ bìa không trên mặt. Trạng thái gửi/loading/empty/error rõ hơn. Input16px, nút album44px, focus ring và dialog trap.
Còn hạn chế: Tailwind CDN/runtime vẫn giữ từ dự án gốc (nên chuyển sang CSS build ở lượt tối ưu sâu nếu cần); tài nguyên hoa PNG ~1MB chưa nén; một số nhãn/lịch giữ chữ nhỏ theo thiệp gốc; chưa chứng nhận WCAG toàn trang hoặc kiểm NVDA/VoiceOver. Form draft giữ khi gửi lỗi nhưng chưa lưu khi refresh. Không tuyên bố đã kiểm thử mọi trình duyệt.

## Tệp và phục hồi
Chỉnh index.html, script.js; thêm theme.css, assets/images và doc. style.css giữ nguyên, theme override độc lập. Các script apply-cover/fix-runtime trong doc là nhật ký thao tác một lần, không chạy lại. Backup D:\CA NHAN\web.history\20261011_220714. Không commit/push; bản GitHub Pages đang công khai chưa cập nhật.
Preview http://127.0.0.1:8765 trên máy MinhThinh. Server chỉ bind127.0.0.1. Không đăng thiệp lên máy chủ bên ngoài.
