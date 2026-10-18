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
let motionOverride = false;
function motionAllowed() { return !reducedMotion.matches || motionOverride; }
let invitationOpened = false;
let albumVisible = false;
let albumHovered = false;
let albumPaused = false;
let albumFocused = false;
let albumDragging = false;
let suppressAlbumClickUntil = 0;
let renderedAlbumIndex = 0;
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
    const running = invitationOpened && albumVisible && !albumHovered && !albumPaused && !albumFocused && !albumDragging && motionAllowed() && !document.hidden && !activeDialog;
    document.querySelector('.album')?.classList.toggle('is-playing', Boolean(running));
    if (running) {
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
// 3. KHỞI TẠO ALBUM TRƯỢT NGANG
// ==========================================
function updateCarousel() {
    const cards = document.querySelectorAll('.carousel-card');
    const total = cards.length;
    if (!total) return;
    const outgoing = cards[renderedAlbumIndex];
    const transferFocus = document.activeElement === outgoing;
    const changed = renderedAlbumIndex !== currentimageIndex;

    cards.forEach((card, i) => {
        card.className = 'carousel-card';
        card.style.removeProperty('--drag-x');
        card.setAttribute('role', 'button');
        card.tabIndex = i === currentimageIndex ? 0 : -1;
        card.setAttribute('aria-hidden', String(i !== currentimageIndex));
        card.setAttribute('aria-label', `Phóng lớn ảnh cưới ${i + 1}`);
        const diff = (i - currentimageIndex + total) % total;

        if (diff === 0) card.classList.add('active');
        else if (diff === 1) card.classList.add('next');
        else if (diff === total - 1) card.classList.add('prev');
    });
    renderedAlbumIndex = currentimageIndex;
    if (changed && transferFocus) cards[currentimageIndex].focus({preventScroll:true});
    const counter = document.getElementById('albumCounter');
    if (counter) counter.textContent = `${String(currentimageIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
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
    if (Date.now() < suppressAlbumClickUntil) return;
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
function syncHeartViewport() {
    const layer = document.querySelector('.opening-hearts');
    if (!layer) return;
    const height = window.visualViewport?.height || window.innerHeight;
    layer.style.height = `${height}px`;
    layer.style.setProperty('--travel', `${height + 80}px`);
}
function startOpeningHearts() {
    if (!motionAllowed() || document.querySelector('.opening-hearts')) return;
    const layer = document.createElement('div');
    layer.className = 'opening-hearts';
    layer.setAttribute('aria-hidden', 'true');
    const count = window.innerWidth < 480 ? 16 : 24;
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('span');
        heart.className = 'opening-heart';
        heart.innerHTML = '<svg viewBox="0 0 32 32" focusable="false" aria-hidden="true"><path d="M16 28C2 18 1 9 6 5c4-3 8-1 10 3 2-4 6-6 10-3 5 4 4 13-10 23Z"/></svg>';
        heart.style.setProperty('--x', `${4 + Math.random() * 92}%`);
        heart.style.setProperty('--size', `${12 + Math.random() * 15}px`);
        const duration = 7 + Math.random() * 5;
        heart.style.setProperty('--duration', `${duration}s`);
        heart.style.setProperty('--delay', `${-duration * (.12 + i / count * .68)}s`);
        heart.style.setProperty('--drift', `${Math.random() * 90 - 45}px`);
        heart.style.setProperty('--heart-color', i % 3 ? '#c8899d' : '#c6a576');
        layer.appendChild(heart);
    }
    document.body.appendChild(layer);
    syncHeartViewport();
    layer.classList.toggle('is-paused', document.hidden);
}
window.addEventListener('resize', syncHeartViewport);
window.visualViewport?.addEventListener('resize', syncHeartViewport);
document.addEventListener('visibilitychange', () => {
    document.querySelector('.opening-hearts')?.classList.toggle('is-paused', document.hidden);
});
function onMotionChange() {
    document.body.classList.toggle('motion-enabled', motionOverride);
    const button = document.getElementById('motionToggle');
    if (button) {
        button.hidden = !invitationOpened || !reducedMotion.matches;
        button.textContent = motionOverride ? 'Tắt hiệu ứng' : 'Bật hiệu ứng';
        button.setAttribute('aria-pressed', String(motionOverride));
    }
    if (!motionAllowed()) document.querySelector('.opening-hearts')?.remove();
    else if (invitationOpened) startOpeningHearts();
    syncAutoplay();
}
if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', onMotionChange);
else if (reducedMotion.addListener) reducedMotion.addListener(onMotionChange);
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
    const cover = document.getElementById('coverScreen');
    const main = document.getElementById('invitation');

    cover.style.display = 'none';
    cover.setAttribute('aria-hidden', 'true');
    main.style.transition = 'none';
    main.classList.remove('opacity-0');
    main.inert = false;
    main.setAttribute('aria-hidden','false');
    document.body.classList.remove('cover-locked');
    invitationOpened = true;
    window.scrollTo(0, 0);
    document.getElementById('invitationHeading')?.focus({preventScroll:true});
    onMotionChange();
    listenForWishes();
    syncAutoplay();
}

if(openBtn) openBtn.addEventListener('click', openInvitation);

function initAlbumInteraction(album) {
    const section = album.closest('.album');
    const track = album.querySelector('.carousel-track');
    const pause = document.getElementById('albumPause');
    let keyboardInteraction = false;
    const syncAlbumFocus = () => {
        albumFocused = keyboardInteraction && section.contains(document.activeElement);
        syncAutoplay();
    };
    document.addEventListener('keydown', e => {
        if (e.key === 'Tab' || section.contains(e.target)) {
            keyboardInteraction = true;
            syncAlbumFocus();
        }
    });
    document.addEventListener('pointerdown', () => {
        keyboardInteraction = false;
        syncAlbumFocus();
    }, {passive:true});
    pause?.addEventListener('click', () => {
        albumPaused = !albumPaused;
        pause.setAttribute('aria-pressed', String(albumPaused));
        pause.textContent = albumPaused ? 'Tiếp tục' : 'Tạm dừng';
        syncAutoplay();
    });
    section.addEventListener('focusin', syncAlbumFocus);
    section.addEventListener('focusout', () => setTimeout(syncAlbumFocus, 0));
    section.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(e); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(e); }
        if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.carousel-card.active')) {
            e.preventDefault(); onCardClick(currentimageIndex);
        }
    });
    let gesture = null;
    track.addEventListener('pointerdown', e => {
        if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
        gesture = {id:e.pointerId, x:e.clientX, y:e.clientY, dx:0, dy:0};
        albumDragging = true; syncAutoplay();
    });
    track.addEventListener('pointermove', e => {
        if (!gesture || e.pointerId !== gesture.id) return;
        gesture.dx = e.clientX - gesture.x; gesture.dy = e.clientY - gesture.y;
        if (Math.abs(gesture.dy) > Math.abs(gesture.dx) && Math.abs(gesture.dy) > 12) {
            finishGesture(false); return;
        }
        if (Math.abs(gesture.dx) > 12) {
            try { track.setPointerCapture(e.pointerId); } catch (_) { /* Pointer may already be cancelled by native scrolling. */ }
            section.classList.add('is-dragging');
            const card = track.querySelector('.active');
            card.style.setProperty('--drag-x', `${gesture.dx}px`);
        }
    });
    function finishGesture(commit) {
        if (!gesture) return;
        const g = gesture; gesture = null;
        if (Math.abs(g.dx) > 12 || Math.abs(g.dy) > 12) suppressAlbumClickUntil = Date.now() + 450;
        section.classList.remove('is-dragging');
        const card = track.querySelector('.active');
        card?.style.removeProperty('--drag-x');
        if (track.hasPointerCapture(g.id)) track.releasePointerCapture(g.id);
        albumDragging = false;
        if (commit && Math.abs(g.dx) > 45 && Math.abs(g.dx) > Math.abs(g.dy) * 1.25) {
            if (g.dx < 0) nextSlide(); else prevSlide();
        }
        syncAutoplay();
    }
    track.addEventListener('pointerup', () => finishGesture(true));
    track.addEventListener('pointercancel', () => finishGesture(false));
    track.addEventListener('lostpointercapture', e => { if (e.target === track) finishGesture(false); });
}

window.addEventListener('DOMContentLoaded', () => {
    createDots(); 
    updateCarousel(); 
    syncMusic();
    const motionButton = document.createElement('button');
    motionButton.id = 'motionToggle';
    motionButton.type = 'button';
    motionButton.hidden = true;
    motionButton.title = 'Thiết bị đang bật giảm chuyển động. Bạn có thể chọn bật tim rơi và album tự chạy.';
    motionButton.setAttribute('aria-label', 'Bật hoặc tắt tim rơi và album tự chạy khi thiết bị giảm chuyển động');
    motionButton.addEventListener('click', () => {
        motionOverride = !motionOverride;
        onMotionChange();
        notify(motionOverride ? 'Đã bật tim rơi và album tự chạy.' : 'Đã tắt hiệu ứng theo cài đặt giảm chuyển động của thiết bị.');
    });
    document.body.appendChild(motionButton);
    
    const album = document.querySelector('.album-carousel-container');
    if (album) {
        initAlbumInteraction(album);
        album.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { albumHovered = true; syncAutoplay(); } });
        album.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { albumHovered = false; syncAutoplay(); } });
        
        const refreshVisible = () => {
            const rect = album.getBoundingClientRect();
            albumVisible = rect.bottom > 0 && rect.top < window.innerHeight;
            syncAutoplay();
        };
        if ('IntersectionObserver' in window) {
            const visible = new IntersectionObserver(entries => {
                albumVisible = entries[0].isIntersecting;
                syncAutoplay();
            }, { threshold: .15 });
            visible.observe(album);
        } else {
            window.addEventListener('scroll', refreshVisible, {passive:true});
            window.addEventListener('resize', refreshVisible);
        }
        const restoreEffects = () => {
            if (document.hidden) return;
            albumHovered = false;
            syncHeartViewport();
            onMotionChange();
            document.querySelector('.opening-hearts')?.classList.remove('is-paused');
            refreshVisible();
        };
        window.addEventListener('pageshow', restoreEffects);
        document.addEventListener('visibilitychange', restoreEffects);
        refreshVisible();
    }
    
    document.addEventListener('visibilitychange', syncAutoplay);
});