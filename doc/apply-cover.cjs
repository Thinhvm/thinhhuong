const fs=require('fs');const p='D:/CA NHAN/web/index.html';let s=fs.readFileSync(p,'utf8');
const icon='<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22%3E%3Crect width=%2232%22 height=%2232%22 rx=%229%22 fill=%22%23fffaf5%22/%3E%3Cpath d=%22M16 26C2 17 3 6 10 6c3 0 5 2 6 4 1-2 3-4 6-4 7 0 8 11-6 20Z%22 fill=%22none%22 stroke=%22%2398576a%22 stroke-width=%221.8%22/%3E%3C/svg%3E">';
s=s.replace('<head>','<head>\n    '+icon);
s=s.replace("50: '#fdfbf7', 100: '#f5efeb', 200: '#eee3d3',","50: '#fffaf5', 100: '#f8eeee', 200: '#e7cdd0',").replace("300: '#e1ceb5', 400: '#ceaf8d', 500: '#b88f68',","300: '#d9b6c0', 400: '#b98696', 500: '#98576a',").replace("600: '#9b714f', 700: '#7d583f', 800: '#5c4d42', 900: '#4e372b',","600: '#875060', 700: '#76515d', 800: '#603d48', 900: '#51323c',");
s=s.replace('<link rel="stylesheet" href="./style.css">','<link rel="stylesheet" href="./style.css?v=20261011">\n    <link rel="stylesheet" href="./theme.css?v=20261011">').replace('src="./script.js"','src="./script.js?v=20261011"');
s=s.replace(/    <link\s+href="https:\/\/fonts.googleapis.com\/css2\?family=Great\+Vibes[\s\S]*?rel="stylesheet">\s*<link[\s\S]*?rel="stylesheet">/, '    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&amp;family=Playfair+Display:ital,wght@0,400;0,600;1,400&amp;family=Plus+Jakarta+Sans:wght@400;500;600&amp;display=swap" rel="stylesheet">');
s=s.replace('<body class="relative min-h-screen">','<body class="relative min-h-screen cover-locked">');
const start=s.indexOf('    <!-- MÀN HÌNH BÌA / MỞ THIỆP -->');const end=s.indexOf('    <!-- NỘI DUNG THIỆP -->');if(start<0||end<start)throw Error('Cover markers missing');
const cover=`    <!-- Bìa hai cánh, giữ chữ trên giấy và ảnh ở lớp trong -->
    <div id="coverScreen" aria-label="Thiệp mời lễ cưới">
        <div id="envelopeWrapper" class="envelope-wrapper">
            <div id="coverCard" class="cover-card">
                <img class="cover-portrait" src="image/DOJ_6644_1.webp" alt="Minh Thịnh và Huỳnh Hương" fetchpriority="high" decoding="async">
                <p class="cover-reveal-name">Minh Thịnh &amp; Huỳnh Hương</p>
                <p class="cover-date">12 . 12 . 2026</p>
            </div>
            <div class="gate gate-left" aria-hidden="true"></div>
            <div class="gate gate-right" aria-hidden="true"></div>
            <div class="gate-copy">
                <p class="cover-eyebrow">Trân trọng kính mời</p>
                <h1 class="cover-names">Minh Thịnh<span>&amp;</span>Huỳnh Hương</h1>
                <p class="cover-date">12 . 12 . 2026</p>
                <p class="cover-lunar-note">Ngày 04 tháng 11 năm Bính Ngọ</p>
                <button id="openInvitation" class="seal-button" type="button" aria-label="Mở thiệp cưới" aria-controls="invitation" aria-expanded="false">
                    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 32C3 21 5 8 12 8c4 0 6 2 8 5 2-3 4-5 8-5 7 0 9 13-8 24Z" stroke="currentColor" stroke-width="1.3"/><path d="M11 21h18" stroke="currentColor" stroke-width=".8" opacity=".5"/></svg>
                </button>
                <p class="cover-hint">Chạm dấu sáp để mở thiệp</p>
            </div>
        </div>
        <p class="cover-footer">Một lời mời · Một ngày chung đôi</p>
    </div>
`;
s=s.slice(0,start)+cover+s.slice(end);
s=s.replace('<div id="invitation"','<main id="invitation" inert aria-hidden="true"');const close=s.indexOf('    <!-- MODAL RSVP -->');const before=s.slice(0,close);s=before.replace(/<\/div>\s*$/,'</main>\n\n')+s.slice(close);
s=s.replace('class="hero bg','tabindex="-1" id="invitationHeading" class="hero bg');
s=s.replace('<!-- Widget Lịch -->','<button type="button" class="action-button" onclick="openRSVPModal()">Xác nhận tham dự</button>\n            <!-- Widget Lịch -->');
s=s.replace('id="guestName" type="text"','id="guestName" aria-label="Họ và tên" maxlength="100" autocomplete="name" type="text"').replace('id="guestWish" rows="3"','id="guestWish" aria-label="Lời chúc dành cho dâu rể" maxlength="2000" rows="3"');
s=s.replace('id="messagesList"></div>','id="messagesList" aria-live="polite"></div>');
s=s.replace('id="lightbox" onclick','id="lightbox" role="dialog" aria-modal="true" aria-label="Ảnh cưới phóng lớn" aria-hidden="true" onclick').replace('id="rsvpModal" class=','id="rsvpModal" role="dialog" aria-modal="true" aria-label="Xác nhận tham dự" aria-hidden="true" class=').replace('id="giftModal"\n','id="giftModal" role="dialog" aria-modal="true" aria-label="Mừng cưới dâu rể" aria-hidden="true"\n');
s=s.replace('onclick="prevSlide(event)"','aria-label="Ảnh trước" onclick="prevSlide(event)"').replace('onclick="nextSlide(event)"','aria-label="Ảnh tiếp theo" onclick="nextSlide(event)"').replace('onclick="closeLightboxForce()"','aria-label="Đóng ảnh" onclick="closeLightboxForce()"').replace('onclick="changeImage(-1, event)"','aria-label="Ảnh trước" onclick="changeImage(-1, event)"').replace('onclick="changeImage(1, event)"','aria-label="Ảnh tiếp theo" onclick="changeImage(1, event)"').replace('title="Bật/Tắt Nhạc"','title="Bật nhạc" aria-label="Bật nhạc" aria-pressed="false"');
s=s.replace('target="_blank"\n','target="_blank" rel="noopener noreferrer"\n');
s=s.replace('</body>','<div id="toast" role="status" aria-live="polite"></div>\n</body>');
fs.writeFileSync(p,s);console.log('Cover, palette, fonts and semantic updates applied');
