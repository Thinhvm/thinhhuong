/* =========================================================
   Thiệp cưới Minh Thịnh & Huỳnh Hương
   ========================================================= */
document.documentElement.classList.add('js');

const WEDDING_TIME = new Date('2026-12-12T10:30:00+07:00');
const ALBUM = [
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

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- Thông báo nhỏ ---------- */
let toastTimer;
function notify(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-shown'), 3200);
}

function escapeHtml(text) {
    return String(text ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
}

/* =========================================================
   NHẠC NỀN
   ========================================================= */
const bgMusic = $('#bgMusic');
const musicBtn = $('#musicBtn');

function syncMusic() {
    const playing = Boolean(bgMusic && !bgMusic.paused);
    musicBtn.classList.toggle('is-playing', playing);
    musicBtn.setAttribute('aria-pressed', String(playing));
    musicBtn.setAttribute('aria-label', playing ? 'Tắt nhạc' : 'Bật nhạc');
    musicBtn.innerHTML = `<span class="music-disc" aria-hidden="true"><i class="fa-solid ${playing ? 'fa-compact-disc' : 'fa-volume-xmark'}"></i></span>`;
}
let musicWanted = false; // false khi khách chủ động tắt nhạc
const unlockEvents = ['pointerdown', 'touchend', 'keydown', 'scroll'];
function retryOnInteraction() {
    // Trình duyệt chặn autoplay → thử phát lại ở lần chạm / cuộn kế tiếp
    const retry = () => {
        unlockEvents.forEach((ev) => window.removeEventListener(ev, retry, true));
        if (musicWanted && bgMusic.paused) playMusic();
    };
    unlockEvents.forEach((ev) => window.addEventListener(ev, retry, { capture: true, passive: true }));
}
function playMusic() {
    if (!bgMusic) return;
    musicWanted = true;
    const p = bgMusic.play();
    if (p) p.catch((err) => {
        syncMusic();
        if (err?.name === 'NotAllowedError') retryOnInteraction();
        else console.warn('Không phát được nhạc nền:', err);
    });
}
bgMusic?.addEventListener('play', syncMusic);
bgMusic?.addEventListener('pause', syncMusic);
musicBtn?.addEventListener('click', () => {
    if (bgMusic.paused) playMusic();
    else { musicWanted = false; bgMusic.pause(); }
});

/* =========================================================
   MỞ THIỆP
   ========================================================= */
let opened = false;
function openInvitation() {
    if (opened) return;
    opened = true;
    playMusic(); // gọi ngay trong cú chạm để trình duyệt cho phép phát nhạc

    const cover = $('#cover');
    const main = $('#invitation');
    const quick = reducedMotion.matches;

    const reveal = () => {
        document.body.classList.remove('is-locked');
        document.body.classList.add('is-open');
        main.inert = false;
        main.setAttribute('aria-hidden', 'false');
        window.scrollTo(0, 0);
        musicBtn.hidden = false;
        $('#giftFab').hidden = false;
        syncMusic();
        startReveal();
        startPetals();
        listenForWishes();
        $('#top')?.focus({ preventScroll: true });
    };

    if (quick) {
        cover.remove();
        reveal();
        return;
    }
    cover.classList.add('is-opening');
    setTimeout(() => cover.classList.add('is-leaving'), 1900);
    setTimeout(reveal, 2200);
    setTimeout(() => cover.remove(), 2800);
}
$('#openBtn')?.addEventListener('click', openInvitation);
$('#envelope')?.addEventListener('click', e => { if (e.target.closest('.env-letter, .env-flap, .env-pocket')) openInvitation(); });

/* =========================================================
   HIỆU ỨNG XUẤT HIỆN KHI CUỘN
   ========================================================= */
let revealObserver;
function startReveal() {
    const items = $$('[data-reveal]');
    items.forEach(el => { if (el.dataset.delay) el.style.setProperty('--delay', `${el.dataset.delay}ms`); });
    if (!('IntersectionObserver' in window) || reducedMotion.matches) {
        items.forEach(el => el.classList.add('is-visible'));
        return;
    }
    revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    items.forEach(el => revealObserver.observe(el));
}

/* =========================================================
   LÁ RƠI
   ========================================================= */
function startPetals() {
    const layer = $('#petals');
    if (!layer || reducedMotion.matches || layer.childElementCount) return;
    const colors = ['#ffffffcc', '#e9dfc4', '#8fa58f', '#d8c49a', '#b8c9b4'];
    const count = window.innerWidth < 480 ? 12 : 18;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('span');
        p.className = 'petal';
        const t = 9 + Math.random() * 8;
        p.style.setProperty('--x', `${Math.random() * 100}%`);
        p.style.setProperty('--s', `${7 + Math.random() * 7}px`);
        p.style.setProperty('--t', `${t}s`);
        p.style.setProperty('--d', `${-Math.random() * t}s`);
        p.style.setProperty('--dx', `${Math.random() * 160 - 80}px`);
        p.style.setProperty('--c', colors[i % colors.length]);
        layer.appendChild(p);
    }
}

/* =========================================================
   LỊCH THÁNG 12/2026 & ĐẾM NGƯỢC
   ========================================================= */
function renderCalendar() {
    const box = $('#calendarDays');
    if (!box) return;
    // 01/12/2026 là thứ Ba; âm lịch: 01/12 = 23/10, 09/12 = 01/11
    const firstWeekday = 1; // số ô trống trước ngày 1 (bắt đầu từ thứ Hai)
    let html = '<span></span>'.repeat(firstWeekday);
    for (let d = 1; d <= 31; d++) {
        const lunar = d < 9 ? (d === 1 ? '23/10' : String(22 + d)) : (d === 9 ? '1/11' : String(d - 8));
        const col = (firstWeekday + d - 1) % 7;
        const cls = ['cal-day', col === 6 ? 'is-sun' : '', d === 12 ? 'is-wedding' : ''].join(' ').trim();
        const label = d === 12 ? ' aria-label="Ngày cưới 12 tháng 12, nhằm 4 tháng 11 âm lịch"' : '';
        html += `<span class="${cls}" role="listitem"${label}>${d}<small>${d === 12 ? '4/11' : lunar}</small></span>`;
    }
    box.innerHTML = html;
}

function startCountdown() {
    const box = $('#countdown');
    if (!box) return;
    const parts = { d: $('[data-cd="d"]', box), h: $('[data-cd="h"]', box), m: $('[data-cd="m"]', box), s: $('[data-cd="s"]', box) };
    const tick = () => {
        let diff = Math.max(0, WEDDING_TIME - Date.now());
        const d = Math.floor(diff / 864e5); diff -= d * 864e5;
        const h = Math.floor(diff / 36e5); diff -= h * 36e5;
        const m = Math.floor(diff / 6e4); diff -= m * 6e4;
        const s = Math.floor(diff / 1e3);
        parts.d.textContent = String(d).padStart(2, '0');
        parts.h.textContent = String(h).padStart(2, '0');
        parts.m.textContent = String(m).padStart(2, '0');
        parts.s.textContent = String(s).padStart(2, '0');
    };
    tick();
    setInterval(tick, 1000);
}

/* =========================================================
   ALBUM & LIGHTBOX
   ========================================================= */
let slide = 0;
let autoplayTimer = null;
let carouselVisible = false;
let carouselHover = false;
let carouselDrag = false;
let suppressClickUntil = 0;

function renderGallery() {
    const track = $('#carouselTrack');
    const dots = $('#carouselDots');
    if (!track) return;
    track.innerHTML = ALBUM.map((src, i) => `
        <button type="button" class="c-card" data-index="${i}" aria-label="Ảnh cưới ${i + 1}">
            <span class="c-inner">
                <img src="${src}" alt="Ảnh cưới ${i + 1}" loading="${i < 2 || i === ALBUM.length - 1 ? 'eager' : 'lazy'}" decoding="async">
                <span class="c-caption"><strong>Save The Date</strong><span>Minh Thịnh &amp; Huỳnh Hương</span></span>
            </span>
        </button>`).join('');
    dots.innerHTML = ALBUM.map((_, i) => `<button type="button" class="carousel-dot" data-index="${i}" aria-label="Xem ảnh ${i + 1}"></button>`).join('');

    track.addEventListener('click', e => {
        const card = e.target.closest('.c-card');
        if (!card || Date.now() < suppressClickUntil) return;
        const i = Number(card.dataset.index);
        if (i === slide) openLightbox(i); else { goTo(i); restartAutoplay(); }
    });
    dots.addEventListener('click', e => {
        const dot = e.target.closest('.carousel-dot');
        if (dot) { goTo(Number(dot.dataset.index)); restartAutoplay(); }
    });
    $('.carousel-prev').addEventListener('click', () => { goTo(slide - 1); restartAutoplay(); });
    $('.carousel-next').addEventListener('click', () => { goTo(slide + 1); restartAutoplay(); });

    const carousel = $('#carousel');
    carousel.addEventListener('mouseenter', () => { carouselHover = true; syncAutoplay(); });
    carousel.addEventListener('mouseleave', () => { carouselHover = false; syncAutoplay(); });
    carousel.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { goTo(slide + 1); restartAutoplay(); }
        if (e.key === 'ArrowLeft') { goTo(slide - 1); restartAutoplay(); }
    });

    // Vuốt ngang
    let g = null;
    track.addEventListener('pointerdown', e => {
        if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
        g = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0 };
        carouselDrag = true; syncAutoplay();
    });
    track.addEventListener('pointermove', e => {
        if (!g || e.pointerId !== g.id) return;
        g.dx = e.clientX - g.x;
        const dy = e.clientY - g.y;
        if (Math.abs(dy) > Math.abs(g.dx) && Math.abs(dy) > 12) { endDrag(false); return; }
        if (Math.abs(g.dx) > 10) {
            carousel.classList.add('is-dragging');
            $('.c-card.active', track)?.style.setProperty('--drag', `${g.dx}px`);
        }
    });
    function endDrag(commit) {
        if (!g) return;
        const dx = g.dx; g = null;
        carousel.classList.remove('is-dragging');
        $('.c-card.active', track)?.style.removeProperty('--drag');
        if (Math.abs(dx) > 10) suppressClickUntil = Date.now() + 400;
        carouselDrag = false;
        if (commit && Math.abs(dx) > 45) goTo(slide + (dx < 0 ? 1 : -1));
        syncAutoplay();
    }
    track.addEventListener('pointerup', () => endDrag(true));
    track.addEventListener('pointercancel', () => endDrag(false));
    track.addEventListener('pointerleave', () => endDrag(true));

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(([entry]) => { carouselVisible = entry.isIntersecting; syncAutoplay(); }, { threshold: 0.3 }).observe(carousel);
    }
    document.addEventListener('visibilitychange', syncAutoplay);
    goTo(0);
}

function goTo(index) {
    const n = ALBUM.length;
    slide = (index + n) % n;
    $$('.c-card').forEach((card, i) => {
        const diff = (i - slide + n) % n;
        card.className = 'c-card' + (
            diff === 0 ? ' active' : diff === 1 ? ' next' : diff === n - 1 ? ' prev' :
            diff === 2 ? ' far-next' : diff === n - 2 ? ' far-prev' : '');
        card.tabIndex = diff === 0 ? 0 : -1;
        card.setAttribute('aria-hidden', String(diff !== 0));
    });
    $$('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === slide);
        dot.setAttribute('aria-current', String(i === slide));
    });
}

function syncAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
    const run = opened && carouselVisible && !carouselHover && !carouselDrag && !activeDialog && !document.hidden && !reducedMotion.matches;
    if (run) autoplayTimer = setInterval(() => goTo(slide + 1), 4500);
}
function restartAutoplay() { syncAutoplay(); }

const lightbox = $('#lightbox');
const lbImg = $('#lightboxImg');
let lbList = ALBUM;
let lbIndex = 0;

function showLightboxImage() {
    lbImg.classList.remove('is-shown');
    const src = lbList[lbIndex];
    const img = new Image();
    img.onload = img.onerror = () => {
        lbImg.src = src;
        requestAnimationFrame(() => lbImg.classList.add('is-shown'));
    };
    img.src = src;
    const many = lbList.length > 1;
    $('.lb-prev', lightbox).hidden = !many;
    $('.lb-next', lightbox).hidden = !many;
    $('#lightboxCount').textContent = many ? `${lbIndex + 1} / ${lbList.length}` : '';
}
function openLightbox(index, list = ALBUM) {
    lbList = list;
    lbIndex = index;
    showLightboxImage();
    openDialog(lightbox);
}
function stepLightbox(step) {
    lbIndex = (lbIndex + step + lbList.length) % lbList.length;
    showLightboxImage();
    if (lbList === ALBUM) goTo(lbIndex);
}
$('.lb-prev', lightbox).addEventListener('click', e => { e.stopPropagation(); stepLightbox(-1); });
$('.lb-next', lightbox).addEventListener('click', e => { e.stopPropagation(); stepLightbox(1); });
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeDialog(lightbox); });

// Vuốt trái/phải trong lightbox
let touchX = null;
lightbox.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 45 && lbList.length > 1) stepLightbox(dx < 0 ? 1 : -1);
});

// Ảnh cô dâu / chú rể
$$('[data-lightbox]').forEach(btn => btn.addEventListener('click', () => openLightbox(0, [btn.dataset.lightbox])));

/* =========================================================
   HỘP THOẠI (mừng cưới, lightbox)
   ========================================================= */
let activeDialog = null;
let returnFocus = null;

function openDialog(dialog) {
    if (activeDialog && activeDialog !== dialog) closeDialog(activeDialog, false);
    returnFocus = document.activeElement;
    activeDialog = dialog;
    dialog.classList.add('is-active');
    dialog.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    $('#invitation').inert = true;
    $('#giftFab').inert = true;
    musicBtn.inert = true;
    syncAutoplay();
    setTimeout(() => $('[data-close]', dialog)?.focus({ preventScroll: true }), 50);
}
function closeDialog(dialog, restore = true) {
    if (!dialog) return;
    dialog.classList.remove('is-active');
    dialog.setAttribute('aria-hidden', 'true');
    if (activeDialog !== dialog) return;
    activeDialog = null;
    document.body.classList.remove('modal-open');
    $('#invitation').inert = false;
    $('#giftFab').inert = false;
    musicBtn.inert = false;
    syncAutoplay();
    if (restore && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
}

const giftModal = $('#giftModal');
$$('[data-open-gift]').forEach(btn => btn.addEventListener('click', () => openDialog(giftModal)));
giftModal.addEventListener('click', e => { if (e.target === giftModal) closeDialog(giftModal); });
$$('[data-close]').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); closeDialog(btn.closest('.modal, .lightbox')); }));

$$('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        notify('Đã sao chép số tài khoản');
    } catch (_) {
        notify(`Số tài khoản: ${btn.dataset.copy}`);
    }
}));

document.addEventListener('keydown', e => {
    if (!activeDialog) return;
    if (e.key === 'Escape') closeDialog(activeDialog);
    if (activeDialog === lightbox && e.key === 'ArrowRight') stepLightbox(1);
    if (activeDialog === lightbox && e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'Tab') {
        const focusable = $$('button:not([hidden]), a[href], input, select, textarea', activeDialog).filter(el => el.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
});

/* =========================================================
   FIREBASE: LƯU BÚT
   ========================================================= */
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

const messagesList = $('#messagesList');
let wishesStarted = false;
function listenForWishes() {
    if (!messagesList || wishesStarted) return;
    wishesStarted = true;
    if (!db) {
        messagesList.innerHTML = '<p class="wishes-empty">Chưa tải được lời chúc. Bạn thử lại sau nhé.</p>';
        return;
    }
    db.collection('wishes').orderBy('timestamp', 'desc').limit(50).onSnapshot(snapshot => {
        if (snapshot.empty) {
            messagesList.innerHTML = '<p class="wishes-empty">Hãy là người đầu tiên gửi lời chúc nhé!</p>';
            return;
        }
        messagesList.innerHTML = snapshot.docs.map(doc => {
            const item = doc.data();
            return `<article class="wish">
                <div class="wish-head"><span class="wish-name">${escapeHtml(item.name)}</span><span class="wish-time">${escapeHtml(item.time || '')}</span></div>
                <p class="wish-text">${escapeHtml(item.wish)}</p>
            </article>`;
        }).join('');
    }, () => {
        messagesList.innerHTML = '<p class="wishes-empty">Chưa tải được lời chúc. Bạn thử lại sau nhé.</p>';
    });
}

async function withSending(form, task) {
    if (form.dataset.sending === 'true') return;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (!db) { notify('Hệ thống đang bận, bạn thử lại sau nhé.'); return; }
    const btn = $('button[type="submit"]', form);
    const label = btn.innerHTML;
    form.dataset.sending = 'true';
    btn.disabled = true;
    btn.textContent = 'Đang gửi...';
    try { await task(); }
    catch (_) { notify('Gửi không thành công, bạn thử lại nhé.'); }
    finally {
        form.dataset.sending = 'false';
        btn.disabled = false;
        btn.innerHTML = label;
    }
}

const wishForm = $('#wishForm');
wishForm?.addEventListener('submit', e => {
    e.preventDefault();
    withSending(wishForm, async () => {
        const name = $('#guestName').value.trim();
        const wish = $('#guestWish').value.trim();
        if (!name || !wish) { notify('Bạn nhập tên và lời chúc nhé.'); return; }
        const time = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
        await db.collection('wishes').add({ name, wish, time, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
        wishForm.reset();
        notify('Đã gửi lời chúc thành công! 💚');
    });
});


/* =========================================================
   KHỞI TẠO
   ========================================================= */
renderCalendar();
renderGallery();
startCountdown();
syncMusic();
