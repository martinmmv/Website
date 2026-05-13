/* ============================================================
   MMV DATA — script.js  (shared across all pages)
============================================================ */

/* ---- Burger / mobile nav ---- */
const burger   = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

burger?.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
});
mobileNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    burger?.classList.remove('open');
  });
});

/* ---- Scroll reveal ---- */
function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.07 });
  els.forEach(el => obs.observe(el));
}
initReveal();

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ---- Form honeypot / basic validation ---- */
document.querySelectorAll('form[data-netlify]').forEach(form => {
  form.addEventListener('submit', e => {
    const required = form.querySelectorAll('[required]');
    let ok = true;
    required.forEach(field => {
      if (!field.value.trim()) {
        ok = false;
        field.style.borderColor = '#c0392b';
        field.addEventListener('input', () => field.style.borderColor = '', { once: true });
      }
    });
    if (!ok) {
      e.preventDefault();
      alert('Please fill in all required fields.');
    }
  });
});
