# Thiệp cưới — Xanh sage / Giấy kem / Nhũ vàng (14/11/2026)

## Hướng thiết kế
Tham khảo tinh thần mẫu "Thiệp cưới xanh trend" (zenlove): nền xanh sage có vân giấy, các khối giấy kem bo vòm, chữ thư pháp, nhành lá trang trí, ảnh trượt/hiện dần khi cuộn. Giữ nguyên toàn bộ thông tin, ảnh thật, QR, Firebase.

## Hệ màu & chữ (biến CSS trong `style.css` → `:root`)
- Nền `--sage #c3d0bf`, giấy kem `--paper #f7f0e1`, giấy phụ `--paper-2 #efe5cf`, thẻ kem `--cream-card #fbf5e8` (không dùng nền trắng)
- Nhấn `--green #4d6b57`, chữ `--green-dark #2f4638`, nhũ `--gold #b8995c`
- Cormorant Garamond (tiêu đề/nhãn), Great Vibes (tên, tiêu đề section), Be Vietnam Pro (thân)
- Đổi tông toàn thiệp chỉ cần sửa các biến này.

## Bìa & cách mở
Tên + ngày phía trên, phong bì kem với dấu sáp xanh ghi "Minh Thịnh ♥ Huỳnh Hương" ở giữa. Chạm dấu sáp →
dấu sáp mờ đi → nắp phong bì lật lên → thiệp ảnh trượt ra → bìa mờ dần, nội dung hiện ra (≈2.2s). Nhạc phát ngay trong cú chạm.

## Thứ tự section (cùng một khuôn: eyebrow → tiêu đề thư pháp → nhành lá vàng)
Hero (vòm ảnh + khối ngày) → Our Story (2 polaroid) → Gia đình & cô dâu chú rể → Ảnh toàn khổ → Tiệc cưới + lịch + đếm ngược → Địa điểm + bản đồ → Album carousel kiểu cũ (9 ảnh, thẻ "Save The Date", nút trước/sau, chấm, vuốt, tự chạy 4.5s) + lightbox → Xác nhận tham dự (Firestore `rsvps`) → Lưu bút (Firestore `wishes`) → Hộp mừng cưới (modal QR, chạm để copy STK) → Cảm ơn.

## Hiệu ứng
`data-reveal="up|down|left|right|zoom|img"` + `data-delay` (ms), kích hoạt một lần bằng IntersectionObserver. Kiểu `img`: khung trượt lên, ảnh thu từ 1.3 → 1. Lá rơi nhẹ sau khi mở. Tôn trọng `prefers-reduced-motion` (mở thẳng, tắt hiệu ứng).
