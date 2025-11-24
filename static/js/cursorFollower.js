// cursorFollower.js
export function initCursorFollower(imageSelector, sectionSelector, { anchorX = 0.5, anchorY = 0.0, relativeToSection = false } = {}, slider = null) {
  const cursorImage = document.querySelector(imageSelector);
  if (!cursorImage) return;

  cursorImage.style.pointerEvents = 'none';
  cursorImage.style.zIndex = '1000';
  cursorImage.style.willChange = 'transform';
  cursorImage.style.position = relativeToSection ? 'absolute' : 'fixed';
  cursorImage.style.opacity = '0';

  if (!cursorImage.style.getPropertyValue('--cursor-offset-x')) cursorImage.style.setProperty('--cursor-offset-x', '0px');
  if (!cursorImage.style.getPropertyValue('--cursor-offset-y')) cursorImage.style.setProperty('--cursor-offset-y', '30px');

  function setBasePosition(xPx, yPx) {
    cursorImage.style.setProperty('--cursor-x', `${xPx}px`);
    cursorImage.style.setProperty('--cursor-y', `${yPx}px`);
  }

  cursorImage.style.transform =
    'translate3d(calc(var(--cursor-x, 0px) + var(--cursor-offset-x, 0px)),' +
    '            calc(var(--cursor-y, 0px) + var(--cursor-offset-y, 0px)), 0)';

  let lastEvent = null;
  let ticking = false;

  function updatePosition(e) {
    const activeSection = document.querySelector(`${sectionSelector}.is-active`);
    if (!activeSection || slider.currentIndex !== 1) {
      cursorImage.classList.remove('is-active');
      cursorImage.style.opacity = '0';
      document.querySelector('header').style.cursor = '';
      return;
    }

    cursorImage.classList.add('is-active');
    cursorImage.style.opacity = '1';
    document.querySelector('header').style.cursor = 'none';

    let baseX = e.clientX;
    let baseY = e.clientY;

    if (relativeToSection) {
      const rect = activeSection.getBoundingClientRect();
      baseX = e.clientX - rect.left;
      baseY = e.clientY - rect.top;

      if (getComputedStyle(activeSection).position === 'static') activeSection.style.position = 'relative';
      if (!activeSection.contains(cursorImage)) activeSection.appendChild(cursorImage);
    } else {
      if (cursorImage.parentElement !== document.body) document.body.appendChild(cursorImage);
    }

    const { width: imgW, height: imgH } = cursorImage.getBoundingClientRect();
    const xPx = Math.round(baseX - imgW * anchorX);
    const yPx = Math.round(baseY - imgH * anchorY);

    setBasePosition(xPx, yPx);
  }

  function onMove(e) {
    lastEvent = e;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (lastEvent) updatePosition(lastEvent);
      });
    }
  }

  window.addEventListener('mousemove', onMove, { passive: true });

  const reflow = () => { if (lastEvent) updatePosition(lastEvent); };
  if (!cursorImage.complete) cursorImage.addEventListener('load', reflow, { once: true });

  window.addEventListener('resize', reflow);
  window.addEventListener('orientationchange', reflow);

  if (slider) {
    slider.onActivateSection = (currentIndex) => {
      if (currentIndex === 1) cursorImage.style.opacity = '1';
      else cursorImage.style.opacity = '0';
    };
  }
}