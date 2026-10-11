# Thiệp cưới — Kem hồng / Champagne

## 1. Hướng thiết kế
Thiệp cưới cho khách hai gia đình, ảnh thật trong vòm, tên riêng khỏi ảnh, giấy kem hồng và viền champagne. Giữ nguyên thông tin và ảnh.

## 2. Hệ thẩm mỹ
Mật độ 4/10, chuyển động 4/10, màu 4/10. Playfair Display: tên bìa/tiêu đề; Great Vibes: điểm nhấn trong thiệp; Plus Jakarta Sans: thân/điều khiển. Tên 30–44px/1.2, tiêu đề 28–36px/1.3, thân 14px/1.75, nhãn 11–12px/1.6. Nền #f8eeee, giấy #fffaf5, nổi #fff, chữ #51323c, chữ phụ #76515d, nhấn #98576a, hover #794155, viền #e7cdd0, champagne #c6a576. Chữ nhạt chỉ cho trang trí.

## 3. Bố cục
Bìa giữa max 430px, co theo chiều cao; hai cánh giấy và dấu sáp button, phía sau chân dung vòm và tên/ngày trên giấy riêng. Nội dung một cột max640px: hero → chuyện tình → gia đình/chân dung → album → giờ/lịch → bản đồ → lưu bút → QR → cảm ơn. Nút RSVP cạnh giờ dùng modal hiện có. Spacing 8/16/24/40/64px, bóng nhẹ và viền mảnh. Không đổi thời gian, hạn RSVP, bản đồ/QR.

## 4. Motion
Bìa fade-up 550ms; dấu sáp mờ/nhấc 250ms; cánh quay Y ±105deg 1100ms; chân dung hiện 700ms sau250ms; bìa fade sau1300ms, tháo1850ms. Tối đa8 cánh hoa CSS ngắn lúc mở, không emoji liên tục. Scroll reveal opacity/translateY18px 600ms một lần. Hover nút2px/ảnh1.035. Reduced motion mở trực tiếp, không hoa/autoplay. Dừng album khi tab khuất/ngoài viewport/modal/hover.

## 5. Không khí
Hoa màu nước ở góc bìa với phần giữa thoáng; giấy kem hồng, viền champagne, chiều sâu nhẹ. Không gradient sặc sỡ/chấm giấy dày.

## 6. Thành phần
Bìa button, guard click lặp, khóa scroll và inert nội dung khi đóng. Hero tên và ảnh riêng. Album dots keyboard, nút có label. Gift/RSVP/lightbox dialog có Escape/focus trap/trả focus. Nhạc theo media event thật, báo lỗi nhẹ. Guestbook loading/empty/error/sending/success, một listener/submit, giữ Firebase schema. QR không đổi. Attribution dùng icon ở góc dưới, quà phía trên tránh đè.

## 7. Hình
Tạo assets/images/blush-botanical.png 2:3: hoa hồng phấn/ivory góc trên trái+dưới phải, lá sage nhạt, giấy #fffaf5,70% giữa trống, không chữ/người. Giữ image/DOJ_6644_1.webp bìa, Cong1.webp hero, ảnh chân dung/album/QR gốc. Các khối thông tin không thêm ảnh vô nghĩa.

## 8. Responsive
320–767: lề16px, một cột, input16px tránh zoom iOS, targets44px, bìa co chiều cao. Tablet/desktop: nội dung giữa max640px, QR2cột. Kiểm overflow320/390/desktop, focus và reduced motion.

## 9. Kỹ thuật
Giữ index.html/style.css/script.js; thêm theme.css/assets/images. Gom font requests, version local CSS/JS. Một DOMContentLoaded/wish submit. Firebase guard và trạng thái lỗi, escape mọi trường, giới hạn query. Test mock không ghi dữ liệu thật. Preview loopback; không commit/push/publish nội dung riêng trong lần này.
