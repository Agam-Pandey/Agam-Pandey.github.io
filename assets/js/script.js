// Utility: prefers-color-scheme
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const yearSpan = document.getElementById('year');

function getStoredTheme() {
  try { return localStorage.getItem('theme'); } catch { return null; }
}
function setStoredTheme(theme) {
  try { localStorage.setItem('theme', theme); } catch {}
}
function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  // Update aria-pressed for accessibility
  const isLight = theme === 'light';
  themeToggle?.setAttribute('aria-pressed', String(isLight));
}
(function initTheme() {
  const stored = getStoredTheme();
  if (stored) return applyTheme(stored);
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(prefersLight ? 'light' : 'dark');
})();

themeToggle?.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  applyTheme(next);
  setStoredTheme(next);
});

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navLinks?.classList.toggle('open');
});

// Smooth close on link click (mobile)
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
  navLinks?.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
}));

// Typewriter effect for tagline (guard to avoid jitter on reflows)
(function typewriter() {
  const el = document.getElementById('typewriter');
  if (!el || el.dataset.typed === '1') return;
  const text = 'Data Science Professional | AI & Machine Learning Solutions';
  let i = 0;
  el.textContent = '';
  const tick = () => {
    el.textContent = text.slice(0, i++);
    if (i <= text.length) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  el.dataset.typed = '1';
})();

// Intersection-based reveal animations
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Mouse glow effect on hero
const glow = document.querySelector('.cursor-glow');
document.addEventListener('mousemove', (e) => {
  if (!glow) return;
  const { clientX, clientY } = e;
  glow.style.left = clientX + 'px';
  glow.style.top = clientY + 'px';
});

// Simple parallax for hero visual
const parallaxEl = document.querySelector('.parallax');
document.addEventListener('scroll', () => {
  if (!parallaxEl) return;
  const depth = parseFloat(parallaxEl.getAttribute('data-parallax-depth') || '15');
  const offset = Math.min(window.scrollY, document.body.offsetHeight - window.innerHeight) * (depth / 1000);
  parallaxEl.style.transform = `translateY(${offset * 80}px)`;
});

// Tilt effect for project cards
document.querySelectorAll('.tilt').forEach(card => {
  const height = 16; // perspective tilt strength
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -height;
    const ry = ((x / rect.width) - 0.5) * height;
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)';
  });
});

// Modal handling for projects
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalTag = document.querySelector('.modal-tag');
const modalList = document.querySelector('.modal-list');

function openModal(project) {
  if (!modal) return;
  modalTitle.textContent = project.title;
  modalTag.textContent = project.tagline;
  modalList.innerHTML = project.details.map(item => `<li>${item}</li>`).join('');
  modal.setAttribute('open', '');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  if (!modal) return;
  modal.removeAttribute('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.open-modal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.currentTarget.closest('.project');
    const data = card?.getAttribute('data-project');
    if (!data) return;
    const project = JSON.parse(data);
    openModal(project);
  });
});
document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// Footer year
if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());

// Particles background (lightweight)
(function particles() {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  const count = Math.min(140, Math.floor((width * height) / 22000));
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.8 + 0.4
  }));
  function step() {
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = 0.9;
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6ee7ff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    // lightweight connections
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#8aa6ff';
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  }
  step();
})();


