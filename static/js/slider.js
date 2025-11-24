// slider.js
export class Slider {
  constructor(sectionSelector, navButtonsSelector) {
    this.sections = Array.from(document.querySelectorAll(sectionSelector));
    this.navButtons = document.querySelectorAll(navButtonsSelector);
    this.currentIndex = this.sections.findIndex(sec => sec.classList.contains('is-active')) || 0;
    this.onActivateSection = null;

    this.navButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetIndex = parseInt(button.dataset.index, 10);
        this.slideTo(targetIndex);
        if (typeof this.onActivateSection === 'function') {
          this.onActivateSection(this.currentIndex);
        }
      });
    });

    window.addEventListener('load', () => this.resetSections());
    window.addEventListener('resize', () => this.resetSections());
  }

  resetSections() {
    this.sections.forEach((section, index) => {
      section.classList.remove('to-left', 'to-right', 'is-active');
      section.style.left = index === this.currentIndex ? '0' : '100%';
      section.style.zIndex = index === this.currentIndex ? '1' : '0';
      if (index === this.currentIndex) section.classList.add('is-active');
      section.style.transition = '';
      section.scrollTop = 0;
    });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  slideTo(targetIndex) {
    if (targetIndex === this.currentIndex || targetIndex < 0 || targetIndex >= this.sections.length) return;

    const current = this.sections[this.currentIndex];
    const target = this.sections[targetIndex];
    const forward = targetIndex > this.currentIndex;

    target.style.transition = 'none';
    target.style.left = forward ? '100%' : '-100%';
    target.style.zIndex = '1';
    target.classList.add('is-active');
    target.scrollTop = 0;

    void target.offsetWidth;

    target.style.transition = '';
    current.style.transition = '';
    current.style.left = forward ? '-100%' : '100%';
    target.style.left = '0';

    setTimeout(() => {
      current.classList.remove('is-active', 'to-left', 'to-right');
      current.style.left = '100%';
      current.style.zIndex = '0';
    }, 500);

    this.currentIndex = targetIndex;

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
}
