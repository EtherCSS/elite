const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const year = document.getElementById('year');

year.textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

menuToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.classList.toggle('active', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const formatNumber = (number) => {
  if (number >= 1000000) return `${(number / 1000000).toFixed(number % 1000000 === 0 ? 0 : 1)}M+`;
  if (number >= 1000) return `${Math.round(number / 1000)}K+`;
  if (number === 100) return '100%';
  return `${number}+`;
};

const animateCounter = (element) => {
  const target = Number(element.dataset.count);
  const duration = 1500;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(target * eased);
    element.textContent = formatNumber(current);

    if (progress < 1) requestAnimationFrame(tick);
    else element.textContent = formatNumber(target);
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('[data-count]').forEach((counter) => counterObserver.observe(counter));

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrame;

const resizeCanvas = () => {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
};

const createParticles = () => {
  const amount = Math.min(90, Math.floor(window.innerWidth / 18));
  particles = Array.from({ length: amount }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2.2 + 0.4,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    alpha: Math.random() * 0.38 + 0.1,
  }));
};

const drawParticles = () => {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
    if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

    ctx.beginPath();
    ctx.fillStyle = `rgba(216, 155, 35, ${p.alpha})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 110) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(21, 101, 216, ${0.09 * (1 - distance / 110)})`;
        ctx.lineWidth = 1;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  });

  animationFrame = requestAnimationFrame(drawParticles);
};

const initCanvas = () => {
  cancelAnimationFrame(animationFrame);
  resizeCanvas();
  createParticles();
  drawParticles();
};

window.addEventListener('resize', initCanvas);
initCanvas();
