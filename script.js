// ==========================================
// 1. DATA ALBUM ẢNH (Khai báo duy nhất 1 lần)
// ==========================================
const albumImages = [
    'img/DOJ_5786_1.jpg', // Index 0: Ảnh Chú Rể
    'img/DOJ_5795_1.jpg', // Index 1: Ảnh Cô Dâu
    'img/ANH BAN (1)_1.jpg',
    'img/ANH BAN (2)_1.jpg',
    'img/ANH BAN (3)_1.jpg',
    'img/ANH BAN (4)_1.jpg',
    'img/ANH BAN (5)_1.jpg',
    'img/Cong2.jpg'
];
let currentImgIndex = 0; // Quản lý slide album & lightbox
let autoplayTimer = null;
const AUTOPLAY_DELAY = 3000; // Thời gian chuyển slide (3 giây)

// ==========================================
// 2. CÁC HÀM XỬ LÝ CHẠY TỰ ĐỘNG (AUTOPLAY)
// ==========================================
function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
        nextSlide();
    }, AUTOPLAY_DELAY);
}

function stopAutoplay() {
    if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }
}

function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
}

// ==========================================
// 3. KHỞI TẠO CAROUSEL 3D ALBUM
// ==========================================
function updateCarousel() {
    const cards = document.querySelectorAll('.carousel-card');
    const total = cards.length;
    if (total === 0) return;

    cards.forEach((card, i) => {
        card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');

        let diff = i - currentImgIndex;

        if (diff < -Math.floor(total / 2)) diff += total;
        if (diff > Math.floor(total / 2)) diff -= total;

        if (diff === 0) {
            card.classList.add('active');
        } else if (diff === -1) {
            card.classList.add('prev');
        } else if (diff === 1) {
            card.classList.add('next');
        } else if (diff === -2 || diff < -2) {
            card.classList.add('far-prev');
        } else if (diff === 2 || diff > 2) {
            card.classList.add('far-next');
        }
    });

    updateDots();
}

function createDots() {
    const dotsContainer = document.getElementById('carouselDots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';
    albumImages.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = `carousel-dot ${idx === currentImgIndex ? 'active' : ''}`;
        dot.onclick = () => {
            currentImgIndex = idx;
            updateCarousel();
            resetAutoplay();
        };
        dotsContainer.appendChild(dot);
    });
}

function updateDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
        if (idx === currentImgIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function nextSlide(e) {
    if (e) e.stopPropagation();
    currentImgIndex = (currentImgIndex + 1) % albumImages.length;
    updateCarousel();
    if (e) resetAutoplay();
}

function prevSlide(e) {
    if (e) e.stopPropagation();
    currentImgIndex = (currentImgIndex - 1 + albumImages.length) % albumImages.length;
    updateCarousel();
    if (e) resetAutoplay();
}

function onCardClick(index) {
    if (index === currentImgIndex) {
        openLightbox(index);
    } else {
        currentImgIndex = index;
        updateCarousel();
        resetAutoplay();
    }
}

// ==========================================
// 4. HIỆU ỨNG LÁ/TRÁI TIM RƠI
// ==========================================
function initFallingLeaves() {
    const container = document.getElementById('fallingLeavesContainer');
    if (!container) return;

    container.innerHTML = '';
    const heartIcons = ['❤️', '💖', '💕', '💗', '🌸', '❣'];
    const totalHearts = 18;

    for (let i = 0; i < totalHearts; i++) {
        const leaf = document.createElement('span');
        leaf.innerHTML = heartIcons[Math.floor(Math.random() * heartIcons.length)];
        leaf.style.left = (Math.random() * 85 + 5) + '%';
        
        const duration = Math.random() * 4 + 5;
        leaf.style.animationDuration = duration + 's';
        leaf.style.animationDelay = (Math.random() * 5) + 's';
        leaf.style.fontSize = (Math.random() * 10 + 14) + 'px';
        
        container.appendChild(leaf);
    }
}

// ==========================================
// 5. MỞ BÌA THIỆP & BẬT/TẮT NHẠC
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
// 6. LỊCH GOOGLE
// ==========================================
function addToCalendar() {
    const title = encodeURIComponent("Lễ Cưới Minh Thịnh & Huỳnh Hương");
    const details = encodeURIComponent("Trân trọng kính mời bạn đến tham dự tiệc cưới của chúng mình!");
    const location = encodeURIComponent("Nhà hàng tiệc cưới Phương Loan, Thôn Thắng Kiên, xã Đề Gi, tỉnh Gia Lai");
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261212T040000Z/20261212T070000Z&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
}

// ==========================================
// 7. LIGHTBOX ALBUM (ZOOM-IN)
// ==========================================
function openLightbox(index) {
    stopAutoplay();
    currentImgIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    if (!lightbox || !lightboxImg) return;

    lightboxImg.src = albumImages[currentImgIndex];
    lightboxImg.classList.remove('zoom-in');

    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex', 'active');

    setTimeout(() => {
        lightboxImg.classList.add('zoom-in');
    }, 50);
}

function changeImage(step, event) {
    if (event) event.stopPropagation();

    const lightboxImg = document.getElementById('lightboxImg');
    if (!lightboxImg) return;

    lightboxImg.classList.remove('zoom-in');

    setTimeout(() => {
        currentImgIndex = (currentImgIndex + step + albumImages.length) % albumImages.length;
        lightboxImg.src = albumImages[currentImgIndex];
        lightboxImg.classList.add('zoom-in');
        updateCarousel();
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
        startAutoplay();
    }, 250);
}

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
// 8. RSVP & GIFT MODAL
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
// 9. GUESTBOOK / LỜI CHÚC
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
// 10. KHỞI CHẠY TRANG
// ==========================================
window.onload = function() {
    initFallingLeaves();
    createDots();
    updateCarousel();
    startAutoplay();

    const carouselContainer = document.querySelector('.album-carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoplay);
        carouselContainer.addEventListener('mouseleave', startAutoplay);
    }
};