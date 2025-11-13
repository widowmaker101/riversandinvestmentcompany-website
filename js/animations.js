document.addEventListener("DOMContentLoaded", () => {
  // Load GSAP + Plugins
  const load = (src, cb) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = cb;
    document.head.appendChild(s);
  };

  load('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', () => {
    load('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', () => {
      load('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/SplitText.min.js', () => {
        load('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/MorphSVGPlugin.min.js', initUltimate);
      });
    });
  });

  function initUltimate() {
    gsap.registerPlugin(ScrollTrigger, SplitText, MorphSVGPlugin);

    // === 1. HERO TEXT: 3D FLIP + BOUNCE ===
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
      const split = new SplitText(heroTitle, { type: "chars,words" });
      gsap.from(split.chars, {
        duration: 1,
        y: 100,
        opacity: 0,
        rotationX: -180,
        transformOrigin: "50% 50% -50",
        ease: "back.out(1.7)",
        stagger: 0.05,
        onComplete: () => split.revert()
      });
    }

    // === 2. LOGO MORPH + GLOW ===
    const logo = document.querySelector('.logo');
    if (logo) {
      gsap.from(logo, {
        scale: 0,
        rotation: 360,
        opacity: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)"
      });
      logo.addEventListener('mouseenter', () => {
        gsap.to(logo, { filter: "drop-shadow(0 0 20px #10B981)", scale: 1.1, duration: 0.3 });
      });
      logo.addEventListener('mouseleave', () => {
        gsap.to(logo, { filter: "none", scale: 1, duration: 0.3 });
      });
    }

    // === 3. PARALLAX LAYERS ===
    const hero = document.querySelector('.hero');
    if (hero) {
      gsap.to(hero, {
        backgroundPosition: "50% 100%",
        ease: "none",
        scrollTrigger: { trigger: hero, scrub: 1, start: "top top", end: "bottom top" }
      });
    }

    // === 4. CARD FLY-IN WITH ELASTIC STAGGER ===
    gsap.utils.toArray('.card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: "top 90%" },
        y: 200,
        rotation: () => gsap.utils.random(-15, 15),
        opacity: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
        delay: i * 0.15
      });
    });

    // === 5. COUNTERS WITH SPARKLES ===
    const counters = document.querySelectorAll('.counter');
    const sparkle = () => {
      const s = document.createElement('div');
      s.innerHTML = '✨';
      s.style.position = 'absolute';
      s.style.fontSize = '1.5rem';
      s.style.pointerEvents = 'none';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      document.body.appendChild(s);
      gsap.to(s, {
        y: -100, opacity: 0, duration: 1, ease: "power2.out",
        onComplete: () => s.remove()
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = +entry.target.dataset.target;
          let count = 0;
          const inc = target / 60;
          const timer = setInterval(() => {
            count += inc;
            if (count >= target) {
              entry.target.textContent = target + (entry.target.textContent.includes('%') ? '%' : '');
              clearInterval(timer);
              setTimeout/sparkle, 100);
            } else {
              entry.target.textContent = Math.floor(count);
            }
          }, 30);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.7 });
    counters.forEach(c => observer.observe(c));

    // === 6. SECTION MORPH ===
    gsap.utils.toArray('section').forEach((sec, i) => {
      if (i > 0) {
        gsap.from(sec, {
          scrollTrigger: { trigger: sec, start: "top 80%" },
          clipPath: "inset(100% 0 0 0)",
          duration: 1.2,
          ease: "power4.out"
        });
      }
    });

    // === 7. SCROLL PROGRESS BAR ===
    const progress = document.createElement('div');
    progress.style.position = 'fixed';
    progress.style.top = 0;
    progress.style.left = 0;
    progress.style.height = '4px';
    progress.style.background = 'linear-gradient(90deg, #10B981, #34D399)';
    progress.style.width = '0%';
    progress.style.zIndex = 9999;
    progress.style.transition = 'width 0.1s ease';
    document.body.appendChild(progress);

    ScrollTrigger.create({
      onUpdate: self => {
        progress.style.width = `${self.progress * 100}%`;
      }
    });

    // === 8. MICRO-INTERACTIONS ===
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.05, boxShadow: "0 20px 25px rgba(16,185,129,0.3)", duration: 0.3 });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, boxShadow: "0 4px 14px rgba(16,185,129,0.3)", duration: 0.3 });
      });
    });

    // === 9. NAV SCROLL + FLOAT ===
    const nav = document.querySelector('nav');
    ScrollTrigger.create({
      start: "top -100",
      end: 99999,
      toggleClass: { className: 'scrolled', targets: nav }
    });
    gsap.to(nav, {
      y: -10,
      duration: 0.3,
      scrollTrigger: { trigger: nav, start: "top top", toggleActions: "play reverse play reverse" }
    });
  }
});
