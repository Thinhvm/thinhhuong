// ==========================================
// 1. DATA ALBUM ẢNH (Khai báo duy nhất 1 lần)
// ==========================================
const albumImages = [
    'img/ANH BAN (1)_1.jpg',
    'img/ANH BAN (2)_1.jpg',
    'img/ANH BAN (3)_1.jpg',
    'img/ANH BAN (4)_1.jpg',
    'img/ANH BAN (5)_1.jpg',
    'img/Cong2.jpg'
];

let currentImgIndex = 0;

// ==========================================
// 2. KHỞI TẠO HIỆU ỨNG LÁ RƠI
// ==========================================
function initFallingLeaves() {
    const container = document.getElementById('fallingLeavesContainer');
    if (!container) return;

    // Xóa nội dung cũ nếu có
    container.innerHTML = '';

    const heartIcons = ['❤️', '💖', '💕', '💗', '🌸', '❣'];
    const totalHearts = 18; // Số lượng vừa đủ trên màn hình điện thoại

    for (let i = 0; i < totalHearts; i++) {
        const leaf = document.createElement('span');
        leaf.innerHTML = heartIcons[Math.floor(Math.random() * heartIcons.length)];
        
        // Vị trí ngang random (từ 5% đến 90%)
        leaf.style.left = (Math.random() * 85 + 5) + '%';
        
        // Thời gian rơi từ 5s đến 9s
        const duration = Math.random() * 4 + 5;
        leaf.style.animationDuration = duration + 's';
        
        // Trễ ngẫu nhiên để không rơi cùng lúc
        leaf.style.animationDelay = (Math.random() * 5) + 's';
        
        // Kích thước trái tim
        leaf.style.fontSize = (Math.random() * 10 + 14) + 'px';
        
        container.appendChild(leaf);
    }
}

// ==========================================
// 3. MỞ BÌA THIỆP & BẬT/TẮT NHẠC
// ==========================================
const openBtn = document.getElementById('openInvitation');
const coverScreen = document.getElementById('coverScreen');
const invitation = document.getElementById('invitation');
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');

let isPlaying = false;

function toggleMusic() {
    if (!bgMusic) return;

    if (isPlaying) {
        bgMusic.pause();
        if (musicIcon) musicIcon.className = "fa-solid fa-music text-gray-400";
    } else {
        bgMusic.play().then(() => {
            if (musicIcon) musicIcon.className = "fa-solid fa-compact-disc fa-spin text-brand-700";
        }).catch(e => console.log("Music play pending user interaction."));
    }
    isPlaying = !isPlaying;
}

if (musicBtn) {
    musicBtn.addEventListener('click', toggleMusic);
}

if (openBtn) {
    openBtn.addEventListener('click', () => {
        if (coverScreen) {
            coverScreen.style.opacity = '0';
            setTimeout(() => {
                coverScreen.style.display = 'none';
                if (invitation) invitation.classList.remove('opacity-0');
            }, 1000);
        }
        toggleMusic();
    });
}

// ==========================================
// 4. THÊM SỰ KIỆN LỊCH GOOGLE
// ==========================================
function addToCalendar() {
    const title = encodeURIComponent("Lễ Cưới Minh Thịnh & Huỳnh Hương");
    const details = encodeURIComponent("Trân trọng kính mời bạn đến tham dự tiệc cưới của chúng mình!");
    const location = encodeURIComponent("White Palace, 194 Hoàng Văn Thụ, Phường 9, Phú Nhuận, TP.HCM");
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261104T110000Z/20261104T140000Z&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
}

// ==========================================
// 5. LIGHTBOX ALBUM (HIỆU ỨNG ZOOM-IN)
// ==========================================
function openLightbox(index) {
    currentImgIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    if (!lightbox || !lightboxImg) return;

    // Gán đường dẫn ảnh
    lightboxImg.src = albumImages[currentImgIndex];
    
    // Reset hiệu ứng zoom
    lightboxImg.classList.remove('zoom-in');

    // Hiển thị Overlay (tương thích Tailwind và CSS thuần)
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex', 'active');

    // Kích hoạt animation phóng to
    setTimeout(() => {
        lightboxImg.classList.add('zoom-in');
    }, 50);
}

function changeImage(step, event) {
    if (event) event.stopPropagation();

    const lightboxImg = document.getElementById('lightboxImg');
    if (!lightboxImg) return;

    // Thu nhỏ ảnh hiện tại
    lightboxImg.classList.remove('zoom-in');

    setTimeout(() => {
        // Tính index mới
        currentImgIndex = (currentImgIndex + step + albumImages.length) % albumImages.length;
        lightboxImg.src = albumImages[currentImgIndex];

        // Phóng to ảnh mới
        lightboxImg.classList.add('zoom-in');
    }, 200);
}

function closeLightbox(event) {
    if (event && event.target.id !== 'lightbox') return;
    closeLightboxForce();
}

function closeLightboxForce() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    if (lightboxImg) {
        lightboxImg.classList.remove('zoom-in');
    }

    setTimeout(() => {
        if (lightbox) {
            lightbox.classList.add('hidden');
            lightbox.classList.remove('flex', 'active');
        }
    }, 250);
}

// Phím tắt bàn phím (Trái, Phải, ESC)
document.addEventListener('keydown', function (e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && (lightbox.classList.contains('active') || !lightbox.classList.contains('hidden'))) {
        if (e.key === 'Escape') {
            closeLightboxForce();
        } else if (e.key === 'ArrowLeft') {
            changeImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeImage(1);
        }
    }
});

// ==========================================
// 6. RSVP & GIFT MODAL FUNCTIONS
// ==========================================
function openRSVPModal() {
    const rsvpModal = document.getElementById('rsvpModal');
    if (rsvpModal) rsvpModal.classList.add('modal-active');
}

function closeRSVPModal() {
    const rsvpModal = document.getElementById('rsvpModal');
    if (rsvpModal) rsvpModal.classList.remove('modal-active');
}

function submitRSVP(e) {
    e.preventDefault();
    alert("Cảm ơn bạn đã phản hồi! Rất hân hạnh được đón tiếp bạn.");
    closeRSVPModal();
}

function toggleGiftModal() {
    const giftModal = document.getElementById('giftModal');
    if (!giftModal) return;
    
    if (giftModal.classList.contains('modal-active')) {
        giftModal.classList.remove('modal-active');
    } else {
        giftModal.classList.add('modal-active');
    }
}

// ==========================================
// 7. GUESTBOOK / NỔI LỜI CHÚC
// ==========================================
const wishForm = document.getElementById('wishForm');
const messagesList = document.getElementById('messagesList');

if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('guestName');
        const wishInput = document.getElementById('guestWish');

        const name = nameInput ? nameInput.value.trim() : '';
        const wish = wishInput ? wishInput.value.trim() : '';

        if (name && wish && messagesList) {
            const now = new Date();
            const timeStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

            const newMsg = document.createElement('div');
            newMsg.className = "p-3.5 bg-white/90 rounded-xl border border-brand-200 text-xs space-y-1 animate-fadeIn";
            newMsg.innerHTML = `
                <div class="flex justify-between items-center font-bold text-brand-900">
                    <span>${escapeHtml(name)}</span>
                    <span class="text-[10px] text-brand-400 font-normal">${timeStr}</span>
                </div>
                <p class="text-brand-700">${escapeHtml(wish)}</p>
            `;

            messagesList.prepend(newMsg);
            wishForm.reset();
        }
    });
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==========================================
// 8. TỰ ĐỘNG CHẠY KHI TẢI TRANG
// ==========================================
window.onload = function() {
    initFallingLeaves();
};