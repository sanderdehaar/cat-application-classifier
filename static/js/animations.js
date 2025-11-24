export function initHeroAnimations() {
  const wrapTextNodes = el => {
    Array.from(el.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        node.replaceWith(span);
      }
    });
  };

  const wrapLoadTextLines = p => {
    const lines = p.innerHTML.split('<br>');
    p.innerHTML = '';
    lines.forEach(line => {
      const span = document.createElement('span');
      span.innerHTML = line;
      span.style.display = 'block';
      p.appendChild(span);
    });
  };

  const animateSection = section => {
    section.querySelectorAll('.animation-reveal').forEach(wrapTextNodes);
    section.querySelectorAll('.load-text').forEach(wrapLoadTextLines);

    const initialDelay = section.id !== 'hero-home' ? 0.2 : 0;
    let tl;

    const resetElements = () => {
      section.querySelectorAll('.animation-reveal span').forEach(span => gsap.set(span, { yPercent: 120, rotationX: 15, opacity: 0 }));
      section.querySelectorAll('.load-text span').forEach(span => gsap.set(span, { yPercent: 120, opacity: 0 }));

      const button = section.querySelector('button');
      if (button) gsap.set(button, { scale: 0.9, rotation: -4, opacity: 0 });

      const cat = section.querySelector('.cat-svg, .cat2-svg');
      if (cat) gsap.set(cat, { y: 0, scale: 0.9, rotation: -5, opacity: 0 });

      const ball = section.querySelector('.cat-ball-svg');
      if (ball) gsap.set(ball, { x: -100, rotation: -15, opacity: 0 });

      const paw = section.querySelector('.cat-paw-svg');
      if (paw) gsap.set(paw, { x: 100, rotation: -10, opacity: 0 });

      const brain = section.querySelector('.brain-svg');
      if (brain) gsap.set(brain, { y: 50, rotation: -5, opacity: 0 });

      const card = section.querySelector('.card');
      if (card) gsap.set(card, { x: 100, rotation: 5, opacity: 0, y: 0 });
    };

    const createTimeline = () => {
      resetElements();

      tl = gsap.timeline({ paused: true, defaults: { duration: 0.25, ease: 'power3.out', delay: initialDelay } });

      section.querySelectorAll('h1.animation-reveal').forEach(el => {
        const children = el.querySelectorAll('span');
        if (!children.length) return;
        tl.fromTo(children,
          { yPercent: 120, rotationX: 15, opacity: 0 },
          { yPercent: 0, rotationX: 0, opacity: 1, stagger: 0.04, duration: 0.35, ease: "back.out(1.7)" }
        );
      });

      section.querySelectorAll('.animation-reveal:not(h1)').forEach(el => {
        const children = el.querySelectorAll('span');
        if (!children.length) return;
        tl.fromTo(children,
          { yPercent: 120, rotationX: 15, opacity: 0 },
          { yPercent: 0, rotationX: 0, opacity: 1, stagger: 0.03, duration: 0.25, ease: "back.out(1.7)" }
        );
      });

      section.querySelectorAll('.load-text').forEach(p => {
        const lines = p.querySelectorAll('span');
        tl.fromTo(lines,
          { yPercent: 120, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.05, duration: 0.25, ease: "back.out(1.5)" }
        );
      });

      const button = section.querySelector('button');
      if (button) {
        tl.fromTo(button,
          { scale: 0.9, rotation: -4, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, ease: 'back.out(2)', duration: 0.25 }, "-=0.1"
        );

        const mouseEnterHandler = () => gsap.to(button, { scale: 1.08, rotation: 4, duration: 0.15, ease: "power1.out" });
        const mouseLeaveHandler = () => gsap.to(button, { scale: 1, rotation: 0, duration: 0.15, ease: "power1.out" });

        const addButtonHover = () => {
          if (window.innerWidth > 650) {
            button.addEventListener('mouseenter', mouseEnterHandler);
            button.addEventListener('mouseleave', mouseLeaveHandler);
          } else {
            button.removeEventListener('mouseenter', mouseEnterHandler);
            button.removeEventListener('mouseleave', mouseLeaveHandler);
            gsap.set(button, { scale: 1, rotation: 0 });
          }
        };

        addButtonHover();
        window.addEventListener('resize', addButtonHover);
      }

      const cat = section.querySelector('.cat-svg, .cat2-svg');
      const ball = section.querySelector('.cat-ball-svg');
      const paw = section.querySelector('.cat-paw-svg');
      const brain = section.querySelector('.brain-svg');
      const card = section.querySelector('.card');

      if (cat && (section.id === 'hero-load' || section.id === 'hero-home')) {
        tl.fromTo(cat,
          { y: -40, scale: 0.9, rotation: -5, opacity: 0 },
          { y: 0, scale: 1, rotation: 0, opacity: 1, ease: "elastic.out(1,0.6)", duration: 0.25 }, "-=0.1"
        );
      }

      if (ball) tl.fromTo(ball, { x: -100, rotation: -15, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, duration: 0.25, ease: "back.out(1.6)" }, "-=0.1");
      if (paw) tl.fromTo(paw, { x: 100, rotation: -10, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, duration: 0.25, ease: "back.out(1.6)" }, "-=0.1");
      if (brain) tl.fromTo(brain, { y: 50, rotation: -5, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.25, ease: "back.out(1.5)" }, "-=0.1");

      if (section.id === 'hero-load') {
        const dots = section.querySelectorAll('.load-animation span');
        if (dots.length) tl.fromTo(dots,
          { yPercent: 50, opacity: 0.3 },
          { yPercent: -50, opacity: 1, stagger: 0.05, duration: 0.25, ease: "power1.inOut", repeat: -1, yoyo: true },
          "-=0.2"
        );
      }

      if (section.id === 'hero-result' && card) {
        if (window.innerWidth > 1200) {
          tl.fromTo(card, { x: 100, rotation: 5, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, ease: "back.out(1.7)", duration: 0.25 }, "-=0.1");
        }

        let cardAnimation;
        const startCardFloat = () => {
          if (window.innerWidth > 1200 && !cardAnimation) {
            cardAnimation = gsap.to(card, { y: 5, rotation: 1, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1 });
          }
        };

        const stopCardFloat = () => {
          if (cardAnimation) {
            cardAnimation.kill();
            cardAnimation = null;
            gsap.set(card, { y: 0, rotation: 0 });
          }
        };

        startCardFloat();
        window.addEventListener('resize', () => {
          if (window.innerWidth <= 1200) stopCardFloat(); else startCardFloat();
        });
      }
    };

    createTimeline();

    section.addEventListener('classChange', () => {
      if (section.classList.contains('is-active') && tl) tl.restart();
    });
  };

  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      if (m.attributeName === 'class') {
        m.target.dispatchEvent(new Event('classChange'));
      }
    });
  });

  document.querySelectorAll('.hero-section').forEach(section => {
    observer.observe(section, { attributes: true });
    animateSection(section);
  });
}
