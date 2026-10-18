# Album trượt ngang và tim di động — 18/10/2026

## Thay đổi
- Album ảnh lớn ở giữa, hé ảnh trước/sau hai bên; bo góc 22px, ảnh bên scale .84 và opacity .5, chuyển ngang 600ms. Giữ toàn bộ 9 ảnh và thông tin cưới.
- Autoplay 4.5 giây khi album trong vùng nhìn. Giữ nút trước/sau, dots, vuốt, lightbox và tạm dừng. Focus bàn phím dừng autoplay, focus do chạm không giữ album đứng mãi; chạm Tiếp tục chạy lại không cần bỏ focus thủ công.
- Tim có vùng vẽ fixed rõ kích thước, bỏ contain:strict; chiều cao dựa visualViewport với fallback innerHeight, cập nhật khi resize; delay phân bố đều để tim hiện ngay. Không ép chạy khi thiết bị bật giảm chuyển động.
- Tăng phiên bản script.js/theme.css thành 20261018-slider1 tránh cache cũ.

## Bằng chứng kiểm thử
- node --check script.js: PASS.
- git diff --check: PASS, chỉ cảnh báo quy ước LF/CRLF.
- Chrome viewport 320x740,390x844,768x900,1280x900,844x390: không tràn ngang, ba ảnh hiển thị, hai ảnh bên hé đúng vị trí, ảnh chính tải được, nút album ít nhất44x44, tim xuất hiện.
- Khung390: chạm Next rồi chờ4750ms tự chuyển ảnh; Pause không chuyển; Resume tự chuyển mà không bỏ focus thủ công. PASS.
- Chạm/vuốt qua Input.dispatchTouchEvent: đổi đúng một ảnh, không mở lightbox sau vuốt. PASS.
- Reduced motion: bỏ tim, dừng autoplay, manual next hoạt động; tắt reduced motion tạo lại đúng một lớp tim. PASS.
- Bộ kiểm thử tương tác: next/prev quay vòng,dots,12 lần chuyển nhanh,keyboard và lightbox,vuốt ngang không chặn dịch dọc,autoplay,dừng ngoài viewport/modal,tim di chuyển: PASS.
- Rà soát ảnh chụp390: ảnh chính thẳng bo góc,ảnh bên hé cân đối,chú thích trên gradient tối,nút và hướng dẫn rõ,tim hiện trên trang.

## Phạm vi và giới hạn
Chỉ chỉnh index.html,script.js,theme.css và thêm bản ghi này. Không đổi ảnh,QR,thông tin gia đình,ngày giờ,nhạc hay Firebase schema. Không gửi biểu mẫu,commit,push hoặc xuất bản dữ liệu riêng. Kiểm thử Chrome máy tính mô phỏng kích thước/touch,không thay thế kiểm thử iPhone/Android hoặc trình duyệt Zalo thực tế. Lỗi mất tim trên điện thoại thật chưa được tái hiện nên chỉ kết luận đã gia cố tương thích và kiểm thử mô phỏng đạt.

Bản dự phòng: D:/CA NHAN/web.history/20261018_161336.
Ảnh chụp và kiểm thử: D:/CA NHAN/web.history/polaroid-qa/slider-*.
