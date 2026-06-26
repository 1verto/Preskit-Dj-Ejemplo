// ============================
// PRESSKIT DJ — MAIN JAVASCRIPT
// ============================

document.addEventListener('DOMContentLoaded', () => {

  // ---- NAVIGATION SCROLL ----
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ---- MOBILE MENU ----
  const burgerBtn = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = burgerBtn.querySelectorAll('span');
      if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const spans = burgerBtn.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  // ---- REVEAL ON SCROLL ----
  const revealElements = document.querySelectorAll(
    '.ejemplo-card, .servicio-card, .testimonio-card, .precio-card, .step, .hook-left, .hook-right, .video-showcase, .compare-card'
  );

  revealElements.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- SMOOTH SCROLL FOR ANCHORS ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- SLOTS COUNTER ANIMATION ----
  const slotsNum = document.getElementById('slots-num');
  if (slotsNum) {
    // Simulate urgency: random slot between 1 and 3
    const slots = Math.floor(Math.random() * 2) + 1;
    slotsNum.textContent = slots;

    // Pulse animation on slots
    setInterval(() => {
      slotsNum.style.transform = 'scale(1.15)';
      slotsNum.style.color = '#ef4444';
      setTimeout(() => {
        slotsNum.style.transform = 'scale(1)';
        slotsNum.style.color = '';
      }, 400);
    }, 4000);
  }

  // ---- CONTACT FORM ----
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submit-btn');
      const originalText = submitBtn.innerHTML;

      // Loading state
      submitBtn.innerHTML = 'Enviando... ⏳';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // Simulate / real form submission
      // For Formspree, remove preventDefault and let the form submit
      // Here we simulate success for demo
      await new Promise(resolve => setTimeout(resolve, 1800));

      // Success state
      submitBtn.innerHTML = '✓ Mensaje enviado — Te contactamos pronto!';
      submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      submitBtn.style.opacity = '1';

      contactForm.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
      }, 5000);
    });
  }

  // ---- PARALLAX HERO IMAGE ----
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroImg.style.transform = `scale(1.05) translateY(${scrolled * 0.3}px)`;
      }
    }, { passive: true });
  }

  // ---- NÚMERO CONTADOR ANIMADO EN HERO ----
  const statNums = document.querySelectorAll('.stat-num');
  statNums.forEach(num => {
    const finalText = num.textContent.trim();
    const match = finalText.match(/^(\+?)(\d+)(.*?)$/);
    if (!match) return;
    const [, prefix, numStr, suffix] = match;
    const final = parseInt(numStr, 10);
    if (isNaN(final)) return;

    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * final);
      num.textContent = `${prefix}${current}${suffix}`;
      if (progress < 1) requestAnimationFrame(update);
    };

    // Start animation when element is visible
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(update);
        observer.disconnect();
      }
    });
    observer.observe(num);
  });

  // ---- GALERÍA CURSOR EFFECT ----
  const galleryImgs = document.querySelectorAll('.marquee-track img');
  galleryImgs.forEach(img => {
    img.addEventListener('mouseenter', () => {
      const track = img.closest('.marquee-track');
      if (track) track.style.animationPlayState = 'paused';
    });
    img.addEventListener('mouseleave', () => {
      const track = img.closest('.marquee-track');
      if (track) track.style.animationPlayState = 'running';
    });
  });

  // ---- ACTIVE NAV LINK ON SCROLL ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= 120) current = section.id;
    });

    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'white';
      }
    });
  }, { passive: true });

  // ---- PRICE CARD HOVER GLOW ----
  document.querySelectorAll('.precio-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      document.querySelectorAll('.precio-card').forEach(c => {
        if (c !== card) c.style.opacity = '0.6';
      });
    });
    card.addEventListener('mouseleave', () => {
      document.querySelectorAll('.precio-card').forEach(c => {
        c.style.opacity = '';
      });
    });
  });

  // ---- CURSOR GLOW EFFECT (subtle) ----
  let cursorGlow = null;

  const createGlow = () => {
    cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
      position: fixed;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(168,85,247,0.04), transparent 70%);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: left 0.15s ease, top 0.15s ease;
      will-change: left, top;
    `;
    document.body.appendChild(cursorGlow);
  };

  createGlow();
  document.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    }
  });

  console.log('%cPRESSKITDJ ◈', 'color: #a855f7; font-size: 24px; font-weight: bold; font-family: sans-serif;');
  console.log('%c¿Interesado en un presskit? → hola@presskitdj.com', 'color: #c084fc; font-size: 14px;');
});
