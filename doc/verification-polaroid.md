# Tim rơi và album Polaroid — 18/10/2026

## Thay đổi
- index.html: tiêu đề album, bộ đếm, gợi ý vuốt, nút tạm dừng; tăng phiên bản URL script/theme tránh cache cũ.
- script.js: tim SVG không phụ thuộc font; khoảng rơi pixel theo innerHeight cập nhật khi resize; delay âm cho tim xuất hiện ngay; fallback MediaQueryList.addListener. Album xếp 3 lớp, rút ảnh trái/phải 360ms, vuốt theo ngón tay, bàn phím, pause/focus/coarse-pointer-safe hover và reduced motion.
- theme.css: Polaroid giấy kem viền champagne, hai lớp ảnh nghiêng phía sau; responsive và targets44px; chân album theo cột trên mobile để tránh nút quà.
- Giữ ảnh cưới thật, nhạc, QR, ngày giờ và biểu mẫu. Không commit/push/deploy hoặc gửi biểu mẫu.

## Chẩn đoán tim
Không tái hiện trực tiếp lỗi trên thiết bị điện thoại thật. Mã trước dùng dvh không có fallback cho trình duyệt cũ, gọi MediaQueryList.addEventListener không có fallback và tắt animation khi prefers-reduced-motion. Các điểm tương thích đã gia cố; không khẳng định một nguyên nhân duy nhất. Thiết bị bật giảm chuyển động vẫn không có tim rơi chủ động theo yêu cầu hệ thống.

## Bằng chứng
- node --check script.js: PASS; git diff --check: PASS (chỉ cảnh báo quy ước LF/CRLF).
- Chrome thực thi viewport320x740,390x844,768x900,1280x900,844x390: không tràn ngang,3 lớp nhìn thấy,ảnh chính tải được,tất cả nút album>=44x44,không pageerror. Mobile16 tim,desktop/tablet24 tim.
- Khung390: tim chuyển Y xuống qua120ms,một lớp duy nhất. Tim SVG nhìn rõ trong screenshot cuối.
- Prev/next và quay vòng0→8→0,dot chọn ảnh,12 lần next nhanh: đúng index,không còn exit class sau450ms.
- Keyboard ArrowRight chuyển ảnh và focus theo ảnh mới,Enter mở lightbox,đóng trả về thiệp.
- Vuốt tổng hợp: drag transform phản hồi -90px,index8→0,không mở lightbox sau vuốt,di chuyển dọc không đổi ảnh,dragging trở false.
- Vuốt bằng Input.dispatchTouchEvent thực của trình duyệt: trái0→1,phải1→0; sửa lostpointercapture từ thẻ con nổi bọt làm hủy gesture sớm. Không pageerror.
- Autoplay đổi ảnh sau4.7s; ngoài viewport và modal không đổi sau4.7s. Hidden-document event dừng timer và pause tim. Nút pause/resume làm đúng trạng thái.
- Reduced-motion runtime: thiệp mở,0 tim,timer=null,manual next hoạt động,không pageerror.
- MediaQueryList giả lập không có addEventListener: thiệp mở,16 timSVG,manual next hoạt động,không pageerror.
- Kiểm tra nguồn: toàn bộ src ảnh HTML khớp bản dự phòng; style.css không đổi; HTML từ lightbox đến cuối trang không đổi.

## Rà soát UX và hoàn thiện
Ảnh chính là trọng tâm,khung giấy và chuyển động rút ảnh đúng lựa chọn Polaroid,không thêm ảnh tổng hợp. Hướng dẫn vuốt có sẵn,nút là đường thay thế cho gesture. Counter và active dot hiển thị chọn hiện tại. Màu/fonts giữ hệ hiện tại. Đã sửa nút quà có khả năng che pause bằng chân album mobile theo cột. Không còn P0/P1 trong phạm vi thay đổi được kiểm thử. Chú thích trang trí nhỏ là đặc điểm giữ từ trang gốc; chưa đánh giá toàn trang theo WCAG.

## Giới hạn
Kiểm thử trên Chrome máy tính với viewport/cảm ứng mô phỏng,không phải iPhone/Android hoặc Zalo/Facebook thật. Không khẳng định tương thích mọi trình duyệt cũ. Kiểm thử không ghi Firebase. Bản trực tuyến chưa cập nhật.

## Dự phòng
D:/CA NHAN/web.history/20261018_154347. Tệp kiểm thử và screenshot tại web.history/polaroid-qa,không nằm trong mã nguồn xuất bản.
