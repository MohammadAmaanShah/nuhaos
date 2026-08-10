// =============================================
//   NUHAOS ELITE PRESENTATION — script.js
// =============================================

let currentSlide = 1;
const totalSlides = 12;

// Build nav dots
function buildNavDots() {
  const container = document.getElementById('nav-dots');
  container.innerHTML = '';
  for (let i = 1; i <= totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = 'nav-dot' + (i === 1 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i}`);
    dot.onclick = () => goToSlide(i);
    dot.title = `Slide ${i}`;
    container.appendChild(dot);
  }
}

function goToSlide(n) {
  if (n < 1 || n > totalSlides) return;

  const current = document.getElementById(`slide-${currentSlide}`);
  const next = document.getElementById(`slide-${n}`);
  if (!current || !next) return;

  // Direction
  const forward = n > currentSlide;
  current.classList.remove('active');
  current.classList.add(forward ? 'prev' : 'next-out');

  // Reset scroll position on the next slide before transition
  next.scrollTop = 0;

  currentSlide = n;

  next.classList.remove('prev', 'next-out');
  next.classList.add('active');

  // Reset animations
  const animEls = next.querySelectorAll('.animate-in');
  animEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
  });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      animEls.forEach(el => {
        el.style.opacity = '';
        el.style.transform = '';
      });
    });
  });

  // Update UI
  updateUI();

  // Clean up old slide
  setTimeout(() => {
    current.classList.remove('prev', 'next-out');
  }, 700);
}

function changeSlide(dir) {
  goToSlide(currentSlide + dir);
}

function updateUI() {
  // Counter
  document.getElementById('slide-counter').textContent = `${currentSlide} / ${totalSlides}`;

  // Progress
  const pct = (currentSlide / totalSlides) * 100;
  document.getElementById('progress-fill').style.width = `${pct}%`;

  // Nav dots
  document.querySelectorAll('.nav-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i + 1 === currentSlide);
  });

  // Prev/Next buttons
  document.getElementById('prev-btn').style.opacity = currentSlide === 1 ? '0.3' : '1';
  document.getElementById('next-btn').style.opacity = currentSlide === totalSlides ? '0.3' : '1';
}

// Keyboard navigation
document.addEventListener('keydown', e => {
  const slide = document.getElementById(`slide-${currentSlide}`);
  if (!slide) return;

  const isScrollable = slide.scrollHeight > slide.clientHeight;

  switch (e.key) {
    case 'ArrowRight':
      // Always transition slide on left/right horizontal arrows
      changeSlide(1);
      break;
    case 'ArrowLeft':
      changeSlide(-1);
      break;

    case 'ArrowDown':
    case 'PageDown':
    case ' ':
      if (isScrollable) {
        const isAtBottom = slide.scrollTop + slide.clientHeight >= slide.scrollHeight - 10;
        if (!isAtBottom) {
          // Let standard scrolling happen
          return;
        }
      }
      e.preventDefault();
      changeSlide(1);
      break;

    case 'ArrowUp':
    case 'PageUp':
      if (isScrollable) {
        const isAtTop = slide.scrollTop <= 10;
        if (!isAtTop) {
          // Let standard scrolling happen
          return;
        }
      }
      e.preventDefault();
      changeSlide(-1);
      break;

    case 'Home':
      e.preventDefault();
      goToSlide(1);
      break;
    case 'End':
      e.preventDefault();
      goToSlide(totalSlides);
      break;
    case 'Escape':
      goToSlide(1);
      break;
  }
});

// Touch/swipe support
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
    changeSlide(dx < 0 ? 1 : -1);
  }
}, { passive: true });

// Mouse wheel navigation (debounced, aware of scrollable content boundaries)
let wheelDebounce = false;
document.addEventListener('wheel', e => {
  const slide = document.getElementById(`slide-${currentSlide}`);
  if (!slide) return;

  const isScrollable = slide.scrollHeight > slide.clientHeight;

  if (e.deltaY > 0) {
    // Scrolling down
    if (isScrollable) {
      const isAtBottom = slide.scrollTop + slide.clientHeight >= slide.scrollHeight - 15;
      if (!isAtBottom) {
        // Let natural scroll happen, do not transition slide
        return;
      }
    }
    // Transition to next slide
    if (wheelDebounce) return;
    wheelDebounce = true;
    changeSlide(1);
    setTimeout(() => { wheelDebounce = false; }, 800);
  } else if (e.deltaY < 0) {
    // Scrolling up
    if (isScrollable) {
      const isAtTop = slide.scrollTop <= 15;
      if (!isAtTop) {
        // Let natural scroll happen, do not transition slide
        return;
      }
    }
    // Transition to previous slide
    if (wheelDebounce) return;
    wheelDebounce = true;
    changeSlide(-1);
    setTimeout(() => { wheelDebounce = false; }, 800);
  }
}, { passive: true });

// Slide "next-out" CSS
const style = document.createElement('style');
style.textContent = `.slide.next-out { transform: translateX(-60px) scale(.97); opacity: 0; }`;
document.head.appendChild(style);

// Initialize
buildNavDots();
updateUI();

// Animate first slide on load
window.addEventListener('load', () => {
  const firstSlide = document.getElementById('slide-1');
  if (firstSlide) {
    const animEls = firstSlide.querySelectorAll('.animate-in');
    animEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animEls.forEach(el => {
          el.style.opacity = '';
          el.style.transform = '';
        });
      });
    });
  }
});
