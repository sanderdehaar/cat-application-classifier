import { Slider } from './slider.js';
import { initFileUpload } from './upload.js';
import { initCursorFollower } from './cursorFollower.js';
import { initVh } from './resizeViewport.js';
import { initHeroAnimations } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
  initVh();
  const slider = new Slider('.hero-section', '.nav-button[data-index]');
  slider.resetSections();
  initFileUpload(slider, '#hero-scan .start-scan button');
  initCursorFollower('#cursor-image', '#hero-scan', {}, slider);
  initHeroAnimations();
});
