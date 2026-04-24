/* ============================================================
   CURSOR
============================================================ */
const cursorDot = document.getElementById('cursorDot');

if (window.matchMedia('(hover: hover)').matches) {
  let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  let tx = cx, ty = cy;

  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
  });

  // Lerp for smooth trail
  (function animCursor() {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    cursorDot.style.left = cx + 'px';
    cursorDot.style.top = cy + 'px';
    requestAnimationFrame(animCursor);
  })();

  // Grow on interactive elements
  const interactives = 'a, button, .proj-card, .skill-pill, .data-item, input, textarea';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.width = '28px';
      cursorDot.style.height = '28px';
      cursorDot.style.opacity = '0.5';
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.style.width = '10px';
      cursorDot.style.height = '10px';
      cursorDot.style.opacity = '1';
    });
  });
}

/* ============================================================
   CANVAS BACKGROUND — Animated data dot field
============================================================ */
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, dots = [];
  const COUNT = 60;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Dot {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) this.reset();
    }
    draw() {
      const isDark = document.body.classList.contains('dark');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(232,118,78,${this.opacity})`
        : `rgba(200,80,42,${this.opacity * 0.6})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) dots.push(new Dot());

  // Draw connecting lines
  function drawLines() {
    const isDark = document.body.classList.contains('dark');
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.12;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = isDark
            ? `rgba(232,118,78,${alpha})`
            : `rgba(200,80,42,${alpha * 0.5})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  (function animate() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => { d.update(); d.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  })();
})();

/* ============================================================
   DARK / LIGHT MODE
============================================================ */
const themeBtn = document.getElementById('themeBtn');

function applyTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  themeBtn.querySelector('.theme-icon').textContent = isDark ? '○' : '◐';
}

themeBtn.addEventListener('click', () => {
  const isDark = !document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  applyTheme(isDark);
});

// Load saved theme (default: light)
const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme === 'dark');

/* ============================================================
   MOBILE MENU
============================================================ */
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', isOpen);
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', false);
  });
});

/* ============================================================
   NAV SHRINK ON SCROLL
============================================================ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.height = window.scrollY > 40 ? '56px' : '64px';
}, { passive: true });

/* ============================================================
   SCROLL REVEAL
============================================================ */
const revealEls = document.querySelectorAll(
  '.about-grid, .about-body, .skills-grid, .proj-card, .contact-grid, .data-strip, .contact-link'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealEls.forEach(el => observer.observe(el));

/* ============================================================
   SMOOTH SCROLL
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ============================================================
   FORM VALIDATION
============================================================ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    const name    = document.getElementById('name')?.value.trim();
    const email   = document.getElementById('email')?.value.trim();
    const message = document.getElementById('message')?.value.trim();
    if (!name || !email || !message) {
      e.preventDefault();
      alert('Please complete all fields before submitting.');
    }
  });
}

/* ============================================================
   HERO NAME — subtle letter tilt on hover
============================================================ */
document.querySelectorAll('.hero-first, .hero-last').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    el.style.transform = `skewX(${x * -3}deg)`;
    el.style.transition = 'transform 0.1s';
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
    el.style.transition = 'transform 0.4s var(--ease-out)';
  });
});
