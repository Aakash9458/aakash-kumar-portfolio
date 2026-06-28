/* ══════════════════════════════════════
   AAKASH KUMAR PORTFOLIO · main.js
   ══════════════════════════════════════ */

// ── PARTICLE BACKGROUND ──
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.3 + 0.3;
      this.vy = -(Math.random() * 0.35 + 0.08);
      this.vx = (Math.random() - 0.5) * 0.12;
      this.alpha = Math.random() * 0.45 + 0.08;
      this.color = Math.random() > 0.6 ? '#00c8ff' : Math.random() > 0.5 ? '#7f5af0' : '#00ffa3';
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(0,200,255,0.022)';
    ctx.lineWidth = 1;
    const sp = 80;
    for (let x = 0; x <= W; x += sp) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += sp) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── MOBILE BURGER ──
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobile-nav');
if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
}

// ── HERO RING ANIMATION ──
function animateRings() {
  const r1 = document.getElementById('ring1');
  const r2 = document.getElementById('ring2');
  const r3 = document.getElementById('ring3');
  if (!r1) return;
  const circ = (r) => 2 * Math.PI * r;
  setTimeout(() => { r1.setAttribute('stroke-dasharray', `${circ(80) * 0.85} ${circ(80)}`); }, 400);
  setTimeout(() => { r2.setAttribute('stroke-dasharray', `${circ(62) * 0.80} ${circ(62)}`); }, 700);
  setTimeout(() => { r3.setAttribute('stroke-dasharray', `${circ(44) * 0.75} ${circ(44)}`); }, 1000);
}
window.addEventListener('load', animateRings);

// ── SCROLL-TRIGGERED SKILL BARS ──
// Uses IntersectionObserver — fires only once when bars enter viewport
const skillBars = document.querySelectorAll('.bar-fill');

const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetWidth = el.getAttribute('data-w') + '%';

        // Small delay so the section is fully visible before animating
        setTimeout(() => {
          el.classList.add('animated');   // enables CSS transition
          el.style.width = targetWidth;   // triggers the animation
        }, 120);

        barObserver.unobserve(el);  // animate only once
      }
    });
  },
  {
    threshold: 0.3,    // 30% of bar must be visible
    rootMargin: '0px 0px -40px 0px'  // trigger slightly before bottom edge
  }
);

skillBars.forEach(bar => {
  bar.style.width = '0%';          // ensure starting state
  barObserver.observe(bar);
});

// ── FADE-IN CARDS ON SCROLL ──
const fadeEls = document.querySelectorAll(
  '.project-card, .tl-card, .cert-card, .info-card, .skill-group, .soft-item, .interest'
);

const fadeObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = (idx % 4) * 70;
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, delay);
        fadeObs.unobserve(el);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);

fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  fadeObs.observe(el);
});

// ── ACTIVE NAV LINK ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

const sectionObs = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const id = entry.target.id;
        document.querySelectorAll(`a[href="#${id}"]`).forEach(l => l.classList.add('active'));
      }
    });
  },
  { threshold: 0.45 }
);
sections.forEach(s => sectionObs.observe(s));

// ── TYPED HERO SUBTITLE ──
const roles = [
  'Data Science',
  'Business Intelligence',
  'Power BI Dashboards',
  'Python Analytics',
  'AI-Driven Insights'
];
let ri = 0, ci = 0, deleting = false;
const titleEl = document.querySelector('.hero-title');

if (titleEl) {
  // Remove the ::after blink cursor CSS since we control text directly
  function type() {
    const current = roles[ri];
    if (!deleting) {
      titleEl.textContent = current.slice(0, ci + 1);
      ci++;
      if (ci === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      titleEl.textContent = current.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
      }
    }
    setTimeout(type, deleting ? 55 : 100);
  }
  titleEl.textContent = '';
  type();
}

// ── CONTACT FORM ──
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn    = document.getElementById('send-btn');
    const status = document.getElementById('form-status');
    const name   = document.getElementById('sender-name').value.trim();
    const email  = document.getElementById('sender-email').value.trim();
    const subj   = document.getElementById('subject').value.trim();
    const msg    = document.getElementById('message').value.trim();

    if (!name || !email || !msg) {
      status.textContent = '⚠ Please fill in all required fields.';
      status.className = 'form-status error';
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Opening mail…';

    const mailtoUrl =
      `mailto:aakashsre4@gmail.com` +
      `?subject=${encodeURIComponent(subj || 'Portfolio Inquiry from ' + name)}` +
      `&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`)}`;

    window.location.href = mailtoUrl;

    setTimeout(() => {
      status.textContent = '✅ Mail client opened — thank you, ' + name + '!';
      status.className = 'form-status success';
      btn.disabled = false;
      btn.innerHTML = '<i class="fa fa-paper-plane"></i> Send Message';
      this.reset();
    }, 1400);
  });
}

// ── ACTIVE NAV STYLE INJECTION ──
const navStyle = document.createElement('style');
navStyle.textContent = `
  .nav-links a.active, .mobile-nav a.active { color: var(--cyan) !important; }
`;
document.head.appendChild(navStyle);
