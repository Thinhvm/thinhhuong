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
    'image/DOJ_7271_1.webp',
    'image/DOJ_7063_1.webp',
    
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
// ==========================================
// 1. KHỞI TẠO FIREBASE VỚI CONFIG CỦA BẠN
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyDlV5F4Y13Ld61uslRCmeCi47ud4gFA-lI",
  authDomain: "minhthinh-12581.firebaseapp.com",
  projectId: "minhthinh-12581",
  storageBucket: "minhthinh-12581.firebasestorage.app",
  messagingSenderId: "1024318003193",
  appId: "1:1024318003193:web:963a4e8620d2e934800f28",
  measurementId: "G-FE19JQSXEC"
};

// Khởi tạo app & cơ sở dữ liệu Cloud Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ==========================================
// 2. RSVP (XÁC NHẬN THAM DỰ) - LƯU VÀO FIREBASE
// ==========================================
function openRSVPModal() {
    const rsvpModal = document.getElementById('rsvpModal');
    if (rsvpModal) rsvpModal.classList.add('modal-active');
}

function closeRSVPModal() {
    const rsvpModal = document.getElementById('rsvpModal');
    if (rsvpModal) rsvpModal.classList.remove('modal-active');
}

async function submitRSVP(e) {
    e.preventDefault();
    const form = e.target;
    
    // Lấy thông tin từ các ô nhập liệu trong Modal RSVP
    const nameInput = form.querySelector('input[type="text"]');
    const guestTypeSelect = form.querySelector('select');
    const attendanceRadio = form.querySelector('input[name="attend"]:checked');

    const name = nameInput ? nameInput.value.trim() : '';
    const guestType = guestTypeSelect ? guestTypeSelect.value : '';
    const attendance = attendanceRadio ? (attendanceRadio.value === 'yes' ? 'Tham dự' : 'Không tham dự') : '';

    if (!name) {
        alert("Vui lòng nhập họ và tên của bạn!");
        return;
    }

    try {
        // Lưu phản hồi RSVP vào collection 'rsvps' trên Firestore
        await db.collection("rsvps").add({
            name: name,
            guestType: guestType,
            attendance: attendance,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("Cảm ơn bạn đã xác nhận phản hồi! Rất hân hạnh được đón tiếp bạn.");
        closeRSVPModal();
        form.reset();
    } catch (error) {
        console.error("Lỗi khi gửi RSVP:", error);
        alert("Có lỗi xảy ra khi gửi xác nhận, vui lòng thử lại sau!");
    }
}

function toggleGiftModal() {
    const giftModal = document.getElementById('giftModal');
    if (giftModal) giftModal.classList.toggle('modal-active');
}

// ==========================================
// 3. SỔ LƯU BÚT (LỜI CHÚC) - TẢI REALTIME & LƯU FIREBASE
// ==========================================
const wishForm = document.getElementById('wishForm');
const messagesList = document.getElementById('messagesList');

// Lắng nghe và cập nhật danh sách lời chúc theo thời gian thực (Realtime)
function listenForWishes() {
    if (!messagesList) return;

    db.collection("wishes")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
          if (snapshot.empty) {
              messagesList.innerHTML = '<p class="text-center text-xs text-brand-400">Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc nhé!</p>';
              return;
          }

          messagesList.innerHTML = snapshot.docs.map(doc => {
              const item = doc.data();
              return `
                  <div class="p-3.5 bg-white/90 rounded-xl border border-brand-200 text-xs space-y-1 animate-fadeIn">
                      <div class="flex justify-between items-center font-bold text-brand-900">
                          <span>${escapeHtml(item.name)}</span>
                          <span class="text-[10px] text-brand-400 font-normal">${item.time || ''}</span>
                      </div>
                      <p class="text-brand-700">${escapeHtml(item.wish)}</p>
                  </div>
              `;
          }).join('');
      }, (error) => {
          console.error("Lỗi khi tải danh sách lời chúc:", error);
      });
}

// Xử lý sự kiện khi khách gửi Form lời chúc
// Sự kiện gửi lời chúc mới
if (wishForm) {
    wishForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('guestName');
        const wishInput = document.getElementById('guestWish');

        const name = nameInput ? nameInput.value.trim() : '';
        const wish = wishInput ? wishInput.value.trim() : '';

        if (name && wish) {
            try {
                const now = new Date();
                
                // 1. Định dạng giờ:phút (thêm số 0 phía trước nếu < 10)
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
                
                // Tạo chuỗi thời gian đầy đủ giờ và ngày
                const timeStr = `${hours}:${minutes} - ${dateStr}`;

                // 2. Lưu lời chúc vào collection 'wishes' trên Firestore
                await db.collection("wishes").add({
                    name: name,
                    wish: wish,
                    time: timeStr, // Giá trị hiển thị mới: HH:mm - DD/MM/YYYY
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });

                wishForm.reset();
                alert("Cảm ơn bạn đã gửi lời chúc ý nghĩa!");
            } catch (error) {
                console.error("Lỗi khi gửi lời chúc:", error);
                alert("Không thể gửi lời chúc. Vui lòng kiểm tra lại kết nối mạng!");
            }
        }
    });
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Khởi chạy khi trang tải xong
window.addEventListener('DOMContentLoaded', () => {
    initFallingLeaves();
    initBalloons();
    createDots();
    updateCarousel();
    startAutoplay();
    
    // Kích hoạt lắng nghe dữ liệu từ Firebase
    listenForWishes();
});

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
// ==========================================
// 4. HIỆU ỨNG TRÁI TIM RƠI (ĐÃ GIẢM SỐ LƯỢNG)
// ==========================================
function initFallingLeaves() {
    const container = document.getElementById('fallingLeavesContainer');
    if (!container) return;

    const fragment = document.createDocumentFragment();
    // Loại bỏ hoa '🌸', chỉ giữ lại các icon Trái tim
    const heartIcons = ['❤️', '💖', '💕', '💗'];
    
    // Giảm từ 15 xuống 7-8 trái tim rơi
    for (let i = 0; i < 7; i++) {
        const leaf = document.createElement('span');
        leaf.innerHTML = heartIcons[Math.floor(Math.random() * heartIcons.length)];
        leaf.style.left = (Math.random() * 90 + 5) + '%';
        // Tăng thời gian rơi thong thả hơn (từ 6s đến 11s)
        leaf.style.animationDuration = (Math.random() * 5 + 6) + 's';
        // Giãn khoảng cách thời gian xuất hiện (độ trễ đến 7s)
        leaf.style.animationDelay = (Math.random() * 7) + 's';
        leaf.style.fontSize = (Math.random() * 6 + 12) + 'px';
        fragment.appendChild(leaf);
    }
    container.appendChild(fragment);
}

// ==========================================
// HIỆU ỨNG TRÁI TIM BAY TỪ DƯỚI LÊN (ĐÃ GIẢM SỐ LƯỢNG)
// ==========================================
function initBalloons() {
    const container = document.getElementById('balloonsContainer');
    if (!container) return;

    // Chỉ giữ lại các icon Trái tim nhẹ nhàng
    const heartIcons = ['❤️', '💖', '💕', '💗'];
    const fragment = document.createDocumentFragment();

    // Giảm từ 15 xuống 6-7 trái tim bay lên
    for (let i = 0; i < 6; i++) {
        const balloon = document.createElement('span');
        balloon.innerHTML = heartIcons[Math.floor(Math.random() * heartIcons.length)];
        
        // Vị trí xuất hiện ngẫu nhiên theo chiều ngang
        balloon.style.left = (Math.random() * 92 + 4) + '%';
        
        // Thời gian bay chậm rãi hơn (từ 9s đến 15s)
        balloon.style.animationDuration = (Math.random() * 6 + 9) + 's';
        
        // Tăng độ trễ xuất hiện để không bị tập trung một lúc (đến 8s)
        balloon.style.animationDelay = (Math.random() * 8) + 's';
        
        // Kích thước vừa phải (16px đến 24px)
        balloon.style.fontSize = (Math.random() * 8 + 16) + 'px';
        
        fragment.appendChild(balloon);
    }
    container.appendChild(fragment);
}

// ==========================================
// KHỞI CHẠY TRANG & SCROLL OBSERVER
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    initFallingLeaves();
    initBalloons(); // <--- Thêm gọi hàm tạo bong bóng ở đây
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