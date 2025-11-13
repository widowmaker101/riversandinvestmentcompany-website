document.addEventListener("DOMContentLoaded", () => {
  const load = (src, cb) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = cb;
    document.head.appendChild(s);
  };

  load('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', () => {
    load('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', () => {
      load('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/TextPlugin.min.js', init);
    });
  });

  function init() {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // HERO TEXT ANIMATION
    const h1 = document.querySelector('.hero h1');
    if (h1) {
      h1.innerHTML = h1.textContent.split('').map(c => 
        c === ' ' ? '&nbsp;' : `<span class="char">${c}</span>`
      ).join('');
      gsap.from('.char', { opacity: 0, y: 80, rotationX: -90, duration: 0.8, ease: "back.out(1.7)", stagger: 0.03 });
    }

    // CARD STAGGER
    gsap.utils.toArray('.card').forEach((c, i) => {
      gsap.from(c, {
        scrollTrigger: { trigger: c, start: "top 85%", toggleActions: "play none none reverse" },
        y: 100, opacity: 0, duration: 0.8, ease: "power3.out", delay: i * 0.1
      });
    });

    // SECTION TITLES
    gsap.utils.toArray('.section-title').forEach(t => {
      gsap.from(t, { scrollTrigger: { trigger: t, start: "top 80%" }, x: -100, opacity: 0, duration: 1, ease: "power2.out" });
    });

    // COUNTERS
    const counters = document.querySelectorAll('.counter');
    const obs = new IntersectionObserver((e) => {
      e.forEach(entry => {
        if (entry.isIntersecting) {
          const target = +entry.target.dataset.target;
          let count = 0;
          const inc = target / 80;
          const timer = setInterval(() => {
            count += inc;
            if (count >= target) {
              entry.target.textContent = target;
              clearInterval(timer);
            } else {
              entry.target.textContent = Math.ceil(count);
            }
          }, 20);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));

    // NAV SCROLL
    const nav = document.querySelector('nav');
    ScrollTrigger.create({ start: "top -80", end: 99999, toggleClass: { className: 'scrolled', targets: nav } });
  }
});
