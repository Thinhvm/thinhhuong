document.addEventListener('DOMContentLoaded', () => {

  // 1. TÍNH NĂNG ĐẾM NGƯỢC (COUNTDOWN)
  // Mốc thời gian: 09:00 ngày 13/12/2026 Dương lịch (Tương ứng 04/11/2026 Âm lịch)
  const weddingDate = new Date('2026-12-13T09:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById('days').innerText = String(days).padStart(2, '0');
      document.getElementById('hours').innerText = String(hours).padStart(2, '0');
      document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
      document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    } else {
      document.getElementById('days').innerText = '00';
      document.getElementById('hours').innerText = '00';
      document.getElementById('minutes').innerText = '00';
      document.getElementById('seconds').innerText = '00';
    }
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 2. PHÁT/TẮT NHẠC NỀN
  const musicBtn = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');
  const musicIcon = document.getElementById('musicIcon');
  let isPlaying = false;

  if (musicBtn && bgMusic) {
    musicBtn.addEventListener('click', () => {
      if (isPlaying) {
        bgMusic.pause();
        musicIcon.classList.remove('spin');
      } else {
        bgMusic.play();
        musicIcon.classList.add('spin');
      }
      isPlaying = !isPlaying;
    });
  }

  // 3. HIỆU ỨNG TRÁI TIM RƠI
  function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart-particle');
    
    const icons = ['♥', '🌸', '💕', '✨'];
    heart.innerText = icons[Math.floor(Math.random() * icons.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    
    const size = Math.random() * 12 + 10;
    heart.style.fontSize = size + 'px';

    const duration = Math.random() * 3 + 4;
    heart.style.animationDuration = duration + 's';

    document.body.appendChild(heart);

    setTimeout(() => { heart.remove(); }, duration * 1000);
  }
  setInterval(createHeart, 450);

  // 4. PHÓNG TO ẢNH THƯ VIỆN (LIGHTBOX)
  const galleryImages = document.querySelectorAll('.gallery-img');
  
  galleryImages.forEach(img => {
    img.addEventListener('click', () => {
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `<img class="lightbox-img" src="${img.src}" alt="Expanded Photo">`;
      
      lightbox.addEventListener('click', () => {
        lightbox.remove();
      });

      document.body.appendChild(lightbox);
    });
  });

  // 5. XỬ LÝ FORM RSVP
  const rsvpForm = document.getElementById('rsvpForm');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Cảm ơn bạn đã gửi xác nhận tham dự cho Thịnh & Hương!');
      rsvpForm.reset();
    });
  }

});