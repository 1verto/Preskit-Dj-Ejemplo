// ============================================
// VALENTIN M. — PRESSKIT LUXURY INTERACTIONS
// ============================================

(function () {
  'use strict';

  // ── PAGE LOADER ──────────────────────────────
  const loader = document.getElementById('page-loader');
  const loaderProgress = document.getElementById('loader-progress');
  const loaderText = document.getElementById('loader-text');
  const body = document.body;

  const loadSteps = [
    { pct: 30,  label: 'Cargando assets...' },
    { pct: 60,  label: 'Preparando experiencia...' },
    { pct: 85,  label: 'Casi listo...' },
    { pct: 100, label: 'Bienvenido ✦' },
  ];

  let stepIndex = 0;
  const runLoader = () => {
    if (stepIndex >= loadSteps.length) return;
    const step = loadSteps[stepIndex++];
    loaderProgress.style.width = step.pct + '%';
    loaderText.textContent = step.label;
    const delay = stepIndex < loadSteps.length ? 400 : 600;
    setTimeout(() => {
      if (stepIndex < loadSteps.length) runLoader();
      else finishLoader();
    }, delay);
  };

  const finishLoader = () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      body.classList.remove('is-loading');
      // Trigger hero char animations
      animateHeroChars();
    }, 400);
  };

  setTimeout(runLoader, 200);

  // ── HERO CHAR ANIMATION ──────────────────────
  const animateHeroChars = () => {
    const chars = document.querySelectorAll('.name-char');
    chars.forEach((char, i) => {
      char.style.animationDelay = `${i * 0.04}s`;
    });
  };

  // ── NAVIGATION SCROLL ──────────────────────
  const pkNav = document.getElementById('pk-nav');
  const demoBar = document.getElementById('demo-bar');
  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    lastScroll = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        if (lastScroll > 80) {
          pkNav.classList.add('solid');
        } else {
          pkNav.classList.remove('solid');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ── SMOOTH ANCHOR SCROLL ──────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = pkNav.offsetHeight + (demoBar ? demoBar.offsetHeight : 0);
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── SCROLL REVEAL ──────────────────────────────
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ── COUNTER ANIMATIONS ──────────────────────────
  const counterEls = document.querySelectorAll('.pk-stat');

  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const numEl = el.querySelector('.pk-stat-num');
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    const duration = 1800;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      numEl.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else numEl.textContent = target;
    };
    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));

  // ── HERO PARALLAX ──────────────────────────────
  const heroBg = document.getElementById('hero-bg');
  const heroImg = document.getElementById('hero-img');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const vh = window.innerHeight;
    if (scrolled < vh && heroImg) {
      const y = scrolled * 0.35;
      heroImg.style.transform = `scale(1.1) translateY(${y}px)`;
    }
  }, { passive: true });

  // ── CUSTOM CURSOR ──────────────────────────────
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    // Follower lags behind
    const followCursor = () => {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(followCursor);
    };
    followCursor();

    // Hover state
    const hoverEls = document.querySelectorAll('a, button, .pk-track, .gallery-item, .magnetic-btn');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hovering');
        follower.classList.add('is-hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovering');
        follower.classList.remove('is-hovering');
      });
    });
  }

  // ── MAGNETIC BUTTONS ──────────────────────────────
  const magneticBtns = document.querySelectorAll('.magnetic-btn');

  if (window.matchMedia('(pointer: fine)').matches) {
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) * 0.25;
        const dy = (e.clientY - cy) * 0.25;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ── GALLERY IMAGE TILT ──────────────────────────────
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (window.matchMedia('(pointer: fine)').matches) {
    galleryItems.forEach(item => {
      item.addEventListener('mousemove', e => {
        const rect = item.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        item.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
      });
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
        item.style.transition = 'transform 0.5s ease';
      });
      item.addEventListener('mouseenter', () => {
        item.style.transition = 'none';
      });
    });
  }

  // ── TRACK HOVER ROWS ──────────────────────────────
  const tracks = document.querySelectorAll('.pk-track');
  tracks.forEach((track, i) => {
    // Stagger entrance
    track.style.opacity = '0';
    track.style.transform = 'translateX(-20px)';
    track.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s, border-color 0.3s ease, background 0.3s ease`;

    const trackObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        track.style.opacity = '1';
        track.style.transform = 'translateX(0)';
        trackObserver.disconnect();
      }
    }, { threshold: 0.2 });
    trackObserver.observe(track);
  });

  // ── RIDER ITEMS STAGGER ──────────────────────────────
  const riderItems = document.querySelectorAll('.rider-item');
  riderItems.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(20px)';
    item.style.transition = `opacity 0.5s ease, transform 0.5s ease`;

    const rObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        }, i * 80);
        rObserver.disconnect();
      }
    }, { threshold: 0.1 });
    rObserver.observe(item);
  });

  // ── ABOUT IMAGE GLARE MOUSE ──────────────────────────────
  const aboutFrame = document.querySelector('.about-img-frame');
  if (aboutFrame && window.matchMedia('(pointer: fine)').matches) {
    aboutFrame.addEventListener('mousemove', e => {
      const rect = aboutFrame.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      const glare = aboutFrame.querySelector('.img-glare');
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.1) 0%, transparent 60%)`;
        glare.style.animation = 'none';
      }
    });
    aboutFrame.addEventListener('mouseleave', () => {
      const glare = aboutFrame.querySelector('.img-glare');
      if (glare) {
        glare.style.background = '';
        glare.style.animation = '';
      }
    });
  }

  // ── EQ BARS TOGGLE ON SCROLL INTO VIEW ──────────────────────────────
  const playerEl = document.querySelector('.pk-mix-player');
  if (playerEl) {
    const eqObserver = new IntersectionObserver(entries => {
      const eq = document.querySelector('.player-eq');
      if (!eq) return;
      if (entries[0].isIntersecting) {
        eq.querySelectorAll('span').forEach(s => s.style.animationPlayState = 'running');
      } else {
        eq.querySelectorAll('span').forEach(s => s.style.animationPlayState = 'paused');
      }
    }, { threshold: 0.5 });
    eqObserver.observe(playerEl);
  }

  // ── ACTIVE NAV LINKS ON SCROLL ──────────────────────────────
  const sections = document.querySelectorAll('section[id], div[id="pk-stats"]');
  const navLinks = document.querySelectorAll('.pk-nav-links a');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'white';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // ── FOOTER BIG TEXT PARALLAX ──────────────────────────────
  const footerLogo = document.querySelector('.footer-logo-big');
  if (footerLogo) {
    const footerObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        window.addEventListener('scroll', () => {
          const rect = footerLogo.getBoundingClientRect();
          const progress = Math.max(0, 1 - rect.top / window.innerHeight);
          footerLogo.style.color = `rgba(255,255,255,${progress * 0.08})`;
          footerLogo.style.transform = `translateX(${-progress * 30}px)`;
        }, { passive: true });
      }
    }, { threshold: 0.1 });
    footerObserver.observe(footerLogo);
  }

  // ── CONSOLE BRANDING ──────────────────────────────
  console.log('%c◈ VALENTIN M. PRESSKIT', 'color: #f59e0b; font-size: 20px; font-weight: bold; font-family: sans-serif;');
  console.log('%c  Diseñado por PresskitDJ → hola@presskitdj.com', 'color: #a855f7; font-size: 12px;');

})();
