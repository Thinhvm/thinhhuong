// ==========================================
// 1. DATA ALBUM ẢNH
// ==========================================
const albumImages = [
    'image/ANH BAN (4)_1.webp',
    'image/Cong2.webp',
    'image/ANH BAN (1)_1.webp',
    'image/DOJ_6227_1.webp',
    'image/DOJ_6851_1.webp',
    'image/DOJ_7032_1.webp',
    'image/DOJ_6149_1.webp',
    'image/DOJ_6509_1.webp',
    'image/DOJ_7063_1.webp'
];

let currentimageIndex = 0;
let autoplayTimer = null;
const AUTOPLAY_DELAY = 3000;

// ==========================================
// 2. CHẠY TỰ ĐỘNG ALBUM (AUTOPLAY)
// ==========================================
function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_DELAY);
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
    if (!total) return;

    cards.forEach((card, i) => {
        card.className = 'carousel-card';
        let diff = i - currentimageIndex;

        if (diff < -Math.floor(total / 2)) diff += total;
        if (diff > Math.floor(total / 2)) diff -= total;

        if (diff === 0) card.classList.add('active');
        else if (diff === -1) card.classList.add('prev');
        else if (diff === 1) card.classList.add('next');
        else if (diff <= -2) card.classList.add('far-prev');
        else if (diff >= 2) card.classList.add('far-next');
    });

    updateDots();
}

function createDots() {
    const dotsContainer = document.getElementById('carouselDots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';
    albumImages.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = `carousel-dot ${idx === currentimageIndex ? 'active' : ''}`;
        dot.onclick = () => {
            currentimageIndex = idx;
            updateCarousel();
            resetAutoplay();
        };
        dotsContainer.appendChild(dot);
    });
}

function updateDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentimageIndex);
    });
}

function nextSlide(e) {
    if (e) e.stopPropagation();
    currentimageIndex = (currentimageIndex + 1) % albumImages.length;
    updateCarousel();
    if (e) resetAutoplay();
}

function prevSlide(e) {
    if (e) e.stopPropagation();
    currentimageIndex = (currentimageIndex - 1 + albumImages.length) % albumImages.length;
    updateCarousel();
    if (e) resetAutoplay();
}

function onCardClick(index) {
    if (index === currentimageIndex) {
        openLightbox(index);
    } else {
        currentimageIndex = index;
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

    const fragment = document.createDocumentFragment();
    const heartIcons = ['❤️', '💖', '💕', '💗', '🌸', '❣'];
    
    for (let i = 0; i < 15; i++) {
        const leaf = document.createElement('span');
        leaf.innerHTML = heartIcons[Math.floor(Math.random() * heartIcons.length)];
        leaf.style.left = (Math.random() * 90 + 5) + '%';
        leaf.style.animationDuration = (Math.random() * 4 + 5) + 's';
        leaf.style.animationDelay = (Math.random() * 5) + 's';
        leaf.style.fontSize = (Math.random() * 8 + 12) + 'px';
        fragment.appendChild(leaf);
    }
    container.appendChild(fragment);
}

// ==========================================
// 5. BẬT / TẮT NHẠC NỀN
// ==========================================
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
        }).catch(() => {});
    }
    isPlaying = !isPlaying;
}

if (musicBtn) {
    musicBtn.addEventListener('click', toggleMusic);
}

// ==========================================
// 6. THÊM VÀO LỊCH GOOGLE
// ==========================================
function addToCalendar() {
    const title = encodeURIComponent("Lễ Cưới Minh Thịnh & Huỳnh Hương");
    const details = encodeURIComponent("Trân trọng kính mời bạn đến tham dự tiệc cưới của chúng mình!");
    const location = encodeURIComponent("Nhà hàng tiệc cưới Phương Loan, Thôn Thắng Kiên, xã Đề Gi, tỉnh Gia Lai");
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261212T040000Z/20261212T070000Z&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
}

// ==========================================
// 7. LIGHTBOX ALBUM (ZOOM-IN & ĐÃ SỬA LỖI)
// ==========================================
function openLightbox(srcOrIndex) {
    stopAutoplay();
    const lightbox = document.getElementById('lightbox');
    const lightboximage = document.getElementById('lightboximage');

    if (!lightbox || !lightboximage) return;

    if (typeof srcOrIndex === 'string') {
        lightboximage.src = srcOrIndex;
        // Tự động đồng bộ index nếu ảnh có trong danh sách albumImages
        const foundIdx = albumImages.indexOf(srcOrIndex);
        if (foundIdx !== -1) {
            currentimageIndex = foundIdx;
        }
    } else if (typeof srcOrIndex === 'number') {
        currentimageIndex = srcOrIndex;
        lightboximage.src = albumImages[currentimageIndex];
    }

    lightboximage.classList.remove('zoom-in');
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex', 'active');

    setTimeout(() => lightboximage.classList.add('zoom-in'), 50);
}

function changeImage(step, event) {
    if (event) event.stopPropagation();

    const lightboximage = document.getElementById('lightboximage');
    if (!lightboximage) return;

    lightboximage.classList.remove('zoom-in');
    setTimeout(() => {
        currentimageIndex = (currentimageIndex + step + albumImages.length) % albumImages.length;
        lightboximage.src = albumImages[currentimageIndex];
        lightboximage.classList.add('zoom-in');
        updateCarousel();
    }, 150);
}

function closeLightbox(event) {
    if (event && event.target.id !== 'lightbox') return;
    closeLightboxForce();
}

function closeLightboxForce() {
    const lightbox = document.getElementById('lightbox');
    const lightboximage = document.getElementById('lightboximage');

    if (lightboximage) lightboximage.classList.remove('zoom-in');

    setTimeout(() => {
        if (lightbox) {
            lightbox.classList.add('hidden');
            lightbox.classList.remove('flex', 'active');
        }
        startAutoplay();
    }, 200);
}

document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && !lightbox.classList.contains('hidden')) {
        if (e.key === 'Escape') closeLightboxForce();
        if (e.key === 'ArrowLeft') changeImage(-1);
        if (e.key === 'ArrowRight') changeImage(1);
    }
});

// ==========================================
// 8. RSVP & MODAL HỘP QUÀ (ĐÃ BỎ MAIL)
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
    e.target.reset();
}

function toggleGiftModal() {
    const giftModal = document.getElementById('giftModal');
    if (giftModal) giftModal.classList.toggle('modal-active');
}

// ==========================================
// 9. LỜI CHÚC: LƯU LOCALSTORAGE (ĐÃ BỎ MAIL)
// ==========================================
const wishForm = document.getElementById('wishForm');
const messagesList = document.getElementById('messagesList');

const defaultWishes = [
    { name: "Mỹ Linh", wish: "Chúc hai bạn trăm năm hạnh phúc, vạn sự như ý, một đám cưới thật vui vẻ và trọn vẹn!", time: "14/11/2026" },
    { name: "Trọng Nhân", wish: "Chúc mừng Thịnh và Hương về chung một nhà! Luôn ngọt ngào như ngày đầu nhé.", time: "14/11/2026" }
];

function renderWishes() {
    if (!messagesList) return;

    const savedWishes = JSON.parse(localStorage.getItem('wedding_wishes')) || defaultWishes;
    messagesList.innerHTML = savedWishes.map(item => `
        <div class="p-3.5 bg-white/90 rounded-xl border border-brand-200 text-xs space-y-1 animate-fadeIn">
            <div class="flex justify-between items-center font-bold text-brand-900">
                <span>${escapeHtml(item.name)}</span>
                <span class="text-[10px] text-brand-400 font-normal">${item.time}</span>
            </div>
            <p class="text-brand-700">${escapeHtml(item.wish)}</p>
        </div>
    `).join('');
}

if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('guestName');
        const wishInput = document.getElementById('guestWish');

        const name = nameInput ? nameInput.value.trim() : '';
        const wish = wishInput ? wishInput.value.trim() : '';

        if (name && wish) {
            const now = new Date();
            const timeStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
            const savedWishes = JSON.parse(localStorage.getItem('wedding_wishes')) || defaultWishes;

            savedWishes.unshift({ name, wish, time: timeStr });
            localStorage.setItem('wedding_wishes', JSON.stringify(savedWishes));

            renderWishes();
            wishForm.reset();
            alert("Cảm ơn bạn đã gửi lời chúc ý nghĩa!");
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
// 10. MỞ THIỆP & LỐC XOÁY
// ==========================================
const openBtn = document.getElementById('openInvitation');
if (openBtn) {
    openBtn.addEventListener('click', () => {
        const envelopeWrapper = document.getElementById('envelopeWrapper');
        const coverScreen = document.getElementById('coverScreen');
        const invitation = document.getElementById('invitation');

        toggleMusic();

        if (envelopeWrapper) {
            envelopeWrapper.classList.add('open');
            setTimeout(() => envelopeWrapper.classList.add('tornado-active'), 200);
        }

        setTimeout(() => {
            if (coverScreen) coverScreen.classList.add('fade-out');
            if (invitation) invitation.classList.remove('opacity-0');
        }, 800);

        setTimeout(() => {
            if (coverScreen) coverScreen.style.display = 'none';
        }, 1300);
    });
}

// ==========================================
// 11. KHỞI CHẠY TRANG & SCROLL OBSERVER
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    initFallingLeaves();
    createDots();
    updateCarousel();
    startAutoplay();
    renderWishes();

    const carouselContainer = document.querySelector('.album-carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoplay);
        carouselContainer.addEventListener('mouseleave', startAutoplay);
    }

    const observerOptions = { threshold: 0.2 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
});