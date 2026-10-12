const fs=require('fs');const p='D:/CA NHAN/web/script.js';let s=fs.readFileSync(p,'utf8');
function between(a,b,replacement){const i=s.indexOf(a),j=s.indexOf(b,i+1);if(i<0||j<0)throw Error('Missing '+a);s=s.slice(0,i)+replacement+'\n\n'+s.slice(j)}
s=s.replace('const AUTOPLAY_DELAY = 3000;',`const AUTOPLAY_DELAY = 4500;
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
    if (invitationOpened && albumVisible && !albumHovered && !document.hidden && !activeDialog && !reducedMotion.matches) {
        autoplayTimer = setInterval(nextSlide, AUTOPLAY_DELAY);
    }
}`);
between('function startAutoplay() {','function stopAutoplay()',`function startAutoplay() { syncAutoplay(); }`);
s=s.replace("const dot = document.createElement('span');","const dot = document.createElement('button');\n        dot.type = 'button';\n        dot.setAttribute('aria-label', `Xem ảnh cưới ${idx + 1}`);");
s=s.replace("dot.classList.toggle('active', idx === currentimageIndex);","dot.classList.toggle('active', idx === currentimageIndex);\n        dot.setAttribute('aria-current', idx === currentimageIndex ? 'true' : 'false');");
s=s.replace("card.className = 'carousel-card';","card.className = 'carousel-card';\n        card.tabIndex = i === currentimageIndex ? 0 : -1;\n        card.setAttribute('aria-label', `Phóng lớn ảnh cưới ${i + 1}`);");
between('function toggleMusic() {','if (musicBtn)',`function syncMusic() {
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
    if (result) result.catch(() => { syncMusic(); notify('Chưa thể phát nhạc. Bạn có thể thử lại bằng nút nhạc.'); });
}
function toggleMusic() {
    if (!bgMusic) return;
    if (bgMusic.paused) playMusic(); else bgMusic.pause();
}
if (bgMusic) {
    bgMusic.addEventListener('play', syncMusic);
    bgMusic.addEventListener('pause', syncMusic);
    bgMusic.addEventListener('error', () => { syncMusic(); notify('Không tải được nhạc nền. Thiệp vẫn xem được bình thường.'); });
}`);
s=s.replace("lightbox.classList.add('flex', 'active');","lightbox.classList.add('flex', 'active');\n    showDialog(lightbox);");
s=s.replace("lightbox.classList.remove('flex', 'active');","lightbox.classList.remove('flex', 'active');\n            hideDialog(lightbox);");
between("document.addEventListener('keydown', (e) => {",'const firebaseConfig =',`function closeRSVPModal() { hideDialog(document.getElementById('rsvpModal')); }
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
    const first = dialog.querySelector('button, input, select, textarea, [tabindex="0"]');
    if (first) first.focus({preventScroll:true});
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
document.addEventListener('keydown', (e) => {
    if (!activeDialog) return;
    if (e.key === 'Escape') {
        e.preventDefault();
        if (activeDialog.id === 'lightbox') closeLightboxForce(); else hideDialog(activeDialog);
    }
    if (activeDialog.id === 'lightbox') {
        if (e.key === 'ArrowLeft') changeImage(-1);
        if (e.key === 'ArrowRight') changeImage(1);
    }
    if (e.key === 'Tab') {
        const nodes = Array.from(activeDialog.querySelectorAll('button,input,select,textarea,a[href],[tabindex="0"]')).filter(el => !el.disabled && el.getClientRects().length);
        if (!nodes.length) return;
        const first = nodes[0], last = nodes[nodes.length-1];
        if (e.shiftKey && document.activeElement === first) {e.preventDefault();last.focus();}
        else if (!e.shiftKey && document.activeElement === last) {e.preventDefault();first.focus();}
    }
});`);
s=s.replace('firebase.initializeApp(firebaseConfig);\r\nconst db = firebase.firestore();',`let db = null;
try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
    }
} catch (error) { console.warn('Không thể kết nối sổ lưu bút:', error.code || error.message); }`);
between('function openRSVPModal() {','// ==========================================\r\n// 3. SỔ LƯU BÚT',`function openRSVPModal() { showDialog(document.getElementById('rsvpModal')); }
async function submitRSVP(e) {
    e.preventDefault();
    const form = e.target;
    if (form.dataset.sending === 'true' || !form.reportValidity()) return;
    const name = form.querySelector('input[type="text"]').value.trim();
    if (!name) { notify('Vui lòng nhập họ và tên.'); return; }
    if (!db) { notify('Chưa kết nối được. Vui lòng thử lại sau.'); return; }
    const button = form.querySelector('button[type="submit"]');
    const label = button.textContent;
    form.dataset.sending = 'true'; button.disabled = true; button.textContent = 'Đang gửi…';
    try {
        await db.collection('rsvps').add({ name, guestType: form.querySelector('select').value,
            attendance: form.querySelector('input[name="attend"]:checked').value === 'yes' ? 'Tham dự' : 'Không tham dự',
            timestamp: firebase.firestore.FieldValue.serverTimestamp() });
        form.reset(); closeRSVPModal(); notify('Cảm ơn bạn đã xác nhận. Hẹn gặp bạn trong ngày chung vui!');
    } catch (error) { notify('Chưa gửi được xác nhận. Thông tin vẫn được giữ để bạn thử lại.'); }
    finally { form.dataset.sending = 'false'; button.disabled = false; button.textContent = label; }
}
function toggleGiftModal() {
    const dialog = document.getElementById('giftModal');
    if (activeDialog === dialog) hideDialog(dialog); else showDialog(dialog);
}`);
s=s.replace('if (!messagesList) return;\r\n\r\n    db.collection("wishes")',`if (!messagesList || wishesStarted) return;
    wishesStarted = true;
    messagesList.textContent = 'Đang tải lời chúc…';
    if (!db) { messagesList.textContent = 'Chưa kết nối được sổ lưu bút. Vui lòng tải lại trang để thử lại.'; return; }
    db.collection("wishes")`);
s=s.replace('.orderBy("timestamp", "desc")','.orderBy("timestamp", "desc").limit(50)');
s=s.replace("${item.time || ''}","${escapeHtml(item.time || '')}");
s=s.replace('console.error("Lỗi khi tải danh sách lời chúc:", error);','messagesList.textContent = "Chưa tải được lời chúc. Vui lòng kiểm tra kết nối và tải lại trang.";');
const wishStart=s.indexOf('// Xử lý sự kiện khi khách gửi Form lời chúc');const wishEnd=s.indexOf('function escapeHtml(text)');
s=s.slice(0,wishStart)+`async function submitWish(e) {
    e.preventDefault();
    if (wishForm.dataset.sending === 'true' || !wishForm.reportValidity()) return;
    const name = document.getElementById('guestName').value.trim();
    const wish = document.getElementById('guestWish').value.trim();
    const status = document.getElementById('wishStatus');
    if (!name || !wish) { status.textContent = 'Vui lòng nhập tên và lời chúc.'; return; }
    if (!db) { status.textContent = 'Chưa kết nối được. Lời chúc chưa được gửi, bạn hãy thử lại sau.'; status.dataset.error = 'true'; return; }
    const button = wishForm.querySelector('button[type="submit"]');
    const label = button.textContent;
    wishForm.dataset.sending = 'true'; wishForm.setAttribute('aria-busy','true'); button.disabled = true;
    button.textContent = 'Đang gửi…'; status.textContent = 'Đang gửi lời chúc của bạn…'; status.dataset.error = 'false';
    try {
        const time = new Intl.DateTimeFormat('vi-VN',{dateStyle:'short',timeStyle:'short',timeZone:'Asia/Ho_Chi_Minh'}).format(new Date());
        await db.collection('wishes').add({ name, wish, time, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
        wishForm.reset(); status.textContent = 'Cảm ơn bạn đã gửi lời chúc dành cho chúng mình!';
    } catch (error) { status.textContent = 'Chưa gửi được lời chúc. Nội dung vẫn được giữ để bạn thử lại.'; status.dataset.error = 'true'; }
    finally {wishForm.dataset.sending = 'false';wishForm.setAttribute('aria-busy','false');button.disabled = false;button.textContent = label;}
}
if (wishForm) {
    const status = document.createElement('p'); status.id = 'wishStatus'; status.className = 'form-status'; status.setAttribute('role','status');
    wishForm.appendChild(status);
    wishForm.addEventListener('submit', submitWish);
}

`+s.slice(wishEnd);
s=s.replace('return text\r\n        .replace','return String(text ?? \'\')\n        .replace');
const opening=s.indexOf('// ==========================================\r\n// 10. MỞ THIỆP');if(opening<0)throw Error('Opening not found');
s=s.slice(0,opening)+`// Mở thiệp một lần, chỉ chạy album và tải lời chúc sau khi mở.
const openBtn = document.getElementById('openInvitation');
function openInvitation() {
    if (invitationOpened || !openBtn || openBtn.disabled) return;
    openBtn.disabled = true;
    openBtn.setAttribute('aria-expanded','true');
    const wrapper = document.getElementById('envelopeWrapper');
    const cover = document.getElementById('coverScreen');
    const main = document.getElementById('invitation');
    if (!reducedMotion.matches && bgMusic && bgMusic.paused) playMusic();
    wrapper.classList.add('open');
    if (!reducedMotion.matches) {
        const petals = document.createElement('div'); petals.className = 'opening-petals'; petals.setAttribute('aria-hidden','true');
        for(let i=0;i<8;i++) { const petal=document.createElement('i');petal.style.setProperty('--x',(12+i*11)+'%');petal.style.setProperty('--delay',(i*.07)+'s');petal.style.setProperty('--drift',(i%2 ? 55:-55)+'px');petals.appendChild(petal); }
        document.body.appendChild(petals);setTimeout(()=>petals.remove(),3000);
    }
    const finish = () => {
        cover.style.display = 'none';
        main.classList.remove('opacity-0');main.inert = false;main.setAttribute('aria-hidden','false');
        document.body.classList.remove('cover-locked');invitationOpened = true;
        window.scrollTo({top:0,behavior:'instant'});
        document.getElementById('invitationHeading').focus({preventScroll:true});
        listenForWishes();syncAutoplay();
    };
    if (reducedMotion.matches) finish();
    else {setTimeout(()=>{ cover.classList.add('fade-out');main.classList.remove('opacity-0'); },1300);setTimeout(finish,1850);}
}
if(openBtn) openBtn.addEventListener('click',openInvitation);
window.addEventListener('DOMContentLoaded', () => {
    createDots(); updateCarousel(); syncMusic();
    const album = document.querySelector('.album-carousel-container');
    if (album) {
        album.addEventListener('mouseenter',()=>{albumHovered=true;syncAutoplay();});
        album.addEventListener('mouseleave',()=>{albumHovered=false;syncAutoplay();});
        album.addEventListener('focusin',()=>{albumHovered=true;syncAutoplay();});
        album.addEventListener('focusout',e=>{if(!album.contains(e.relatedTarget)){albumHovered=false;syncAutoplay();}});
        const visible = new IntersectionObserver(entries=>{albumVisible=entries[0].isIntersecting;syncAutoplay();},{threshold:.15});visible.observe(album);
    }
    document.addEventListener('visibilitychange',syncAutoplay);
    reducedMotion.addEventListener('change',syncAutoplay);
    const reveal = new IntersectionObserver((entries,observer)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target);}});},{threshold:.08});
    document.querySelectorAll('#invitation>section:not(.hero)').forEach(el=>{el.classList.add('section-reveal');reveal.observe(el);});
    document.querySelectorAll('.carousel-card,[onclick^="openLightbox"],#giftBoxTrigger').forEach(el=>{
        el.setAttribute('role','button'); if(!el.classList.contains('carousel-card'))el.tabIndex=0;
        if(!el.hasAttribute('aria-label'))el.setAttribute('aria-label',el.querySelector('img')?.alt || 'Mở mã QR mừng cưới');
        el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}});
    });
    ['giftModal','rsvpModal'].forEach(id=>{const dialog=document.getElementById(id);dialog.addEventListener('click',e=>{if(e.target===dialog)hideDialog(dialog);});dialog.querySelector('button').setAttribute('aria-label','Đóng cửa sổ');});
});
`;
fs.writeFileSync(p,s);console.log('Runtime consolidated');
