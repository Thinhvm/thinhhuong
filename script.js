// ==========================================
// 1. DATA ALBUM ẢNH
// ==========================================
const albumImages = [
    'image/ANH BAN (4)_1.webp',
    'image/DOJ_5889_1.webp',
    'image/ANH BAN (1)_1.webp',
    'image/DOJ_6227_1.webp',
    'image/DOJ_6851_1.webp',
    'image/DOJ_7032_1.webp',
    'image/DOJ_6149_1.webp',
    'image/DOJ_7271_1.webp',
    'image/DOJ_7063_1.webp',
];

let currentimageIndex = 0;
let autoplayTimer = null;
const AUTOPLAY_DELAY = 4500;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let invitationOpened = false;
let albumVisible = false;
let albumHovered = false;
let activeDialog = null;
let dialogReturnFocus = null;
let wishesStarted = false;
let toastTimer;

function notify(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.textContent = ''; }, 5000);
}

function syncAutoplay() {
    stopAutoplay();
    if (invitationOpened && albumVisible && !albumHovered && !document.hidden && !activeDialog) {
        autoplayTimer = setInterval(nextSlide, AUTOPLAY_DELAY);
    }
}

// ==========================================
// 2. CHẠY TỰ ĐỘNG ALBUM (AUTOPLAY)
// ==========================================
function startAutoplay() { syncAutoplay(); }

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
        card.tabIndex = i === currentimageIndex ? 0 : -1;
        card.setAttribute('aria-label', `Phóng lớn ảnh cưới ${i + 1}`);
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
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Xem ảnh cưới ${idx + 1}`);
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
        dot.setAttribute('aria-current', idx === currentimageIndex ? 'true' : 'false');
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
// 5. BẬT / TẮT NHẠC NỀN
// ==========================================
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');
let isPlaying = false;

function syncMusic() {
    isPlaying = Boolean(bgMusic && !bgMusic.paused);
    if (musicIcon) musicIcon.className = isPlaying ? 'fa-solid fa-compact-disc fa-spin text-brand-700' : 'fa-solid fa-music';
    if (musicBtn) {
        musicBtn.setAttribute('aria-pressed', String(isPlaying));
        musicBtn.setAttribute('aria-label', isPlaying ? 'Tắt nhạc' : 'Bật nhạc');
        musicBtn.title = isPlaying ? 'Tắt nhạc' : 'Bật nhạc';
    }
}

function playMusic() {
    if (!bgMusic) return;
    const result = bgMusic.play();
    if (result) result.catch(() => { syncMusic(); });
}

function toggleMusic() {
    if (!bgMusic) return;
    if (bgMusic.paused) playMusic(); else bgMusic.pause();
}

if (bgMusic) {
    bgMusic.addEventListener('play', syncMusic);
    bgMusic.addEventListener('pause', syncMusic);
}

if (musicBtn) {
    musicBtn.addEventListener('click', toggleMusic);
}

// ==========================================
// 7. LIGHTBOX ALBUM
// ==========================================
function openLightbox(srcOrIndex) {
    stopAutoplay();
    const lightbox = document.getElementById('lightbox');
    const lightboximage = document.getElementById('lightboximage');

    if (!lightbox || !lightboximage) return;

    if (typeof srcOrIndex === 'string') {
        lightboximage.src = srcOrIndex;
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
    showDialog(lightbox);

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
            hideDialog(lightbox);
        }
        startAutoplay();
    }, 200);
}

function closeRSVPModal() { hideDialog(document.getElementById('rsvpModal')); }

function showDialog(dialog) {
    if (!dialog || !invitationOpened) return;
    if (activeDialog && activeDialog !== dialog) hideDialog(activeDialog);
    dialogReturnFocus = document.activeElement;
    activeDialog = dialog;
    dialog.classList.add(dialog.id === 'lightbox' ? 'active' : 'modal-active');
    dialog.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-locked');
    document.getElementById('musicBtn').inert = true;
    const main = document.getElementById('invitation');
    if (!main.contains(dialog)) main.inert = true;
    else Array.from(main.children).forEach(el => { if (el !== dialog) el.inert = true; });
    stopAutoplay();
}

function hideDialog(dialog) {
    if (!dialog) return;
    dialog.classList.remove('modal-active', 'active');
    dialog.setAttribute('aria-hidden', 'true');
    if (activeDialog === dialog) {
        activeDialog = null;
        document.body.classList.remove('modal-locked');
        document.getElementById('musicBtn').inert = false;
        const main = document.getElementById('invitation');
        main.inert = false;
        Array.from(main.children).forEach(el => { el.inert = false; });
        if (dialogReturnFocus && dialogReturnFocus.isConnected) dialogReturnFocus.focus({preventScroll:true});
        syncAutoplay();
    }
}

// FIREBASE INIT
let db = null;
try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) firebase.initializeApp({
            apiKey: "AIzaSyDlV5F4Y13Ld61uslRCmeCi47ud4gFA-lI",
            authDomain: "minhthinh-12581.firebaseapp.com",
            projectId: "minhthinh-12581",
            storageBucket: "minhthinh-12581.firebasestorage.app",
            messagingSenderId: "1024318003193",
            appId: "1:1024318003193:web:963a4e8620d2e934800f28"
        });
        db = firebase.firestore();
    }
} catch (error) { console.warn('Firebase init warning:', error); }

function openRSVPModal() { showDialog(document.getElementById('rsvpModal')); }

async function submitRSVP(e) {
    e.preventDefault();
    const form = e.target;
    if (form.dataset.sending === 'true' || !form.reportValidity()) return;
    const name = form.querySelector('input[type="text"]').value.trim();
    if (!name || !db) return;
    try {
        await db.collection('rsvps').add({ 
            name, 
            guestType: form.querySelector('select').value,
            attendance: form.querySelector('input[name="attend"]:checked').value === 'yes' ? 'Tham dự' : 'Không tham dự',
            timestamp: firebase.firestore.FieldValue.serverTimestamp() 
        });
        form.reset(); closeRSVPModal(); notify('Cảm ơn bạn đã xác nhận tham dự!');
    } catch (error) { notify('Có lỗi xảy ra, vui lòng thử lại.'); }
}

function toggleGiftModal() {
    const dialog = document.getElementById('giftModal');
    if (activeDialog === dialog) hideDialog(dialog); else showDialog(dialog);
}

const wishForm = document.getElementById('wishForm');
const messagesList = document.getElementById('messagesList');

function listenForWishes() {
    if (!messagesList || wishesStarted) return;
    wishesStarted = true;
    if (!db) return;
    db.collection("wishes").orderBy("timestamp", "desc").limit(50).onSnapshot((snapshot) => {
        if (snapshot.empty) {
            messagesList.innerHTML = '<p class="text-center text-xs text-brand-400">Chưa có lời chúc nào.</p>';
            return;
        }
        messagesList.innerHTML = snapshot.docs.map(doc => {
            const item = doc.data();
            return `
                <div class="p-3.5 bg-white/90 rounded-xl border border-brand-200 text-xs space-y-1">
                    <div class="flex justify-between items-center font-bold text-brand-900">
                        <span>${escapeHtml(item.name)}</span>
                        <span class="text-[10px] text-brand-400 font-normal">${escapeHtml(item.time || '')}</span>
                    </div>
                    <p class="text-brand-700">${escapeHtml(item.wish)}</p>
                </div>
            `;
        }).join('');
    });
}

async function submitWish(e) {
    e.preventDefault();
    if (wishForm.dataset.sending === 'true' || !wishForm.reportValidity()) return;
    const name = document.getElementById('guestName').value.trim();
    const wish = document.getElementById('guestWish').value.trim();
    if (!name || !wish || !db) return;
    try {
        const time = new Intl.DateTimeFormat('vi-VN',{dateStyle:'short',timeStyle:'short',timeZone:'Asia/Ho_Chi_Minh'}).format(new Date());
        await db.collection('wishes').add({ name, wish, time, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
        wishForm.reset(); notify('Đã gửi lời chúc thành công!');
    } catch (error) { notify('Gửi lời chúc không thành công.'); }
}

if (wishForm) {
    wishForm.addEventListener('submit', submitWish);
}

function escapeHtml(text) {
    return String(text ?? '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// XỬ LÝ MỞ THIỆP & KÍCH HOẠT TRỰC TIẾP NHẠC
const openBtn = document.getElementById('openInvitation');
function startOpeningHearts() {
    if (reducedMotion.matches || document.querySelector('.opening-hearts')) return;
    const layer = document.createElement('div');
    layer.className = 'opening-hearts';
    layer.setAttribute('aria-hidden', 'true');
    const count = window.innerWidth < 480 ? 16 : 24;
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('span');
        heart.className = 'opening-heart' + (i % 2 ? ' rising' : '');
        heart.textContent = '♥';
        heart.style.setProperty('--x', `${4 + Math.random() * 92}%`);
        heart.style.setProperty('--size', `${12 + Math.random() * 15}px`);
        heart.style.setProperty('--duration', `${7 + Math.random() * 5}s`);
        heart.style.setProperty('--delay', `${i < 2 ? 0 : Math.random() * 6}s`);
        heart.style.setProperty('--drift', `${Math.random() * 90 - 45}px`);
        heart.style.setProperty('--heart-color', i % 3 ? '#c8899d' : '#c6a576');
        layer.appendChild(heart);
    }
    document.body.appendChild(layer);
    layer.classList.toggle('is-paused', document.hidden);
}
document.addEventListener('visibilitychange', () => {
    document.querySelector('.opening-hearts')?.classList.toggle('is-paused', document.hidden);
});
reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) document.querySelector('.opening-hearts')?.remove();
    else if (invitationOpened) startOpeningHearts();
});
function openInvitation() {
    if (invitationOpened || !openBtn || openBtn.disabled) return;
    
    // Phát nhạc trực tiếp ngay trong tương tác chạm/click của người dùng
    if (bgMusic) {
        bgMusic.play().then(() => {
            syncMusic();
        }).catch(err => {
            syncMusic();
            notify('Chưa phát được nhạc. Bạn chạm nút nhạc để thử lại nhé.');
        });
    }

    openBtn.disabled = true;
    openBtn.setAttribute('aria-expanded','true');
    const wrapper = document.getElementById('envelopeWrapper');
    const cover = document.getElementById('coverScreen');
    const main = document.getElementById('invitation');
    
    wrapper.classList.add('open');
    startOpeningHearts();
    
    const finish = () => {
        cover.style.display = 'none';
        main.classList.remove('opacity-0');
        main.inert = false;
        main.setAttribute('aria-hidden','false');
        document.body.classList.remove('cover-locked');
        invitationOpened = true;
        window.scrollTo({top:0,behavior:'instant'});
        listenForWishes();
        syncAutoplay();
    };

    setTimeout(finish, reducedMotion.matches ? 0 : 1950);
}

if(openBtn) openBtn.addEventListener('click', openInvitation);

window.addEventListener('DOMContentLoaded', () => {
    createDots(); 
    updateCarousel(); 
    syncMusic();
    
    const album = document.querySelector('.album-carousel-container');
    if (album) {
        album.addEventListener('mouseenter', () => { albumHovered = true; syncAutoplay(); });
        album.addEventListener('mouseleave', () => { albumHovered = false; syncAutoplay(); });
        
        const visible = new IntersectionObserver(entries => {
            albumVisible = entries[0].isIntersecting;
            syncAutoplay();
        }, { threshold: .15 });
        visible.observe(album);
    }
    
    document.addEventListener('visibilitychange', syncAutoplay);
});