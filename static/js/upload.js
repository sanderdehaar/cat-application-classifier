export function initFileUpload(slider, scanButtonSelector) {
  const scanButton = document.querySelector(scanButtonSelector);
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.jpg,.jpeg,.png';
  const cursorEl = document.getElementById('cursor-image');

  function bindMobileNavButtons() {
    document.querySelectorAll('#information-mobile .nav-button').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetIndex = parseInt(btn.dataset.index, 10);
        slider.slideTo(targetIndex);
        if (cursorEl && targetIndex === 1) cursorEl.style.opacity = '1';
      });
    });
  }

  function showUploadModal() {
    const modal = document.createElement('div');
    modal.id = 'upload-modal';

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    const content = document.createElement('div');
    content.className = 'modal-content';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-modal';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    const p = document.createElement('p');
    p.textContent = "For the best results, upload a clear photo of your cat showing its face and body. Make sure your cat is the main object in the image and not objects like tables, glasses, or toys. Use good lighting and a simple background. AI may sometimes make mistakes and results are for guidance only.";

    const uploadButton = document.createElement('button');
    uploadButton.textContent = "Upload Image";
    uploadButton.addEventListener('click', () => {
      fileInput.value = '';
      // fileInput.click();
      document.body.removeChild(modal);
    });

    content.appendChild(closeBtn);
    content.appendChild(p);
    content.appendChild(uploadButton);
    modal.appendChild(content);
    document.body.appendChild(modal);
  }

  scanButton.addEventListener('click', () => {
    showUploadModal();
  });

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;

    // Reset the UI
    document.querySelector('#hero-result h2').textContent = 'Loading...';
    const descriptionEl = document.querySelector('#hero-result .bottom p');
    descriptionEl.textContent = 'Loading breed info...';
    const imageEl = document.querySelector('#hero-result .information img');
    imageEl.src = '';

    const traitsList = document.querySelector('#hero-result .data ul');
    traitsList.innerHTML = '';

    const mobileSection = document.getElementById('information-mobile');
    if (mobileSection) mobileSection.innerHTML = '';

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
      alert('Only JPG, JPEG, or PNG files are allowed.');
      return;
    }

    if (cursorEl) cursorEl.style.opacity = '0';
    slider.slideTo(2);

    const startTime = Date.now();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/predict', { method: 'POST', body: formData });
      const data = await res.json();
      const elapsed = Date.now() - startTime;
      const waitTime = Math.max(3000 - elapsed, 0);

      setTimeout(async () => {
        if (data.error) {
          alert(data.error);
          slider.slideTo(1);
          if (cursorEl && slider.currentIndex === 1) cursorEl.style.opacity = '1';
          return;
        }

        console.log('Predicted cat breed:', data.prediction);

        document.querySelector('#hero-result h2').textContent = data.prediction;
        descriptionEl.textContent = 'Loading breed info...';
        traitsList.innerHTML = '';

        try {
          const apiRes = await fetch(`https://api.thecatapi.com/v1/breeds/search?q=${data.prediction}`);
          const breeds = await apiRes.json();
          let breed = breeds.length ? breeds[0] : null;

          let cleanDescription = breed?.description?.replace(/<br\s*\/?>/gi, ' ').trim() || 'N/A';
          if (window.innerWidth > 1200) {
            const maxWords = 40;
            const wordsArray = cleanDescription.split(/\s+/);
            if (wordsArray.length > maxWords) {
              cleanDescription = wordsArray.slice(0, maxWords).join(' ') + '…';
            }
          }
          descriptionEl.textContent = cleanDescription;

          const traitsData = {
            origin: breed?.origin || 'N/A',
            character: breed?.temperament || 'N/A',
            childFriendly: breed?.child_friendly ? `${breed.child_friendly}/5` : 'N/A',
            dogFriendly: breed?.dog_friendly ? `${breed.dog_friendly}/5` : 'N/A',
            energyLevel: breed?.energy_level ? `${breed.energy_level}/5` : 'N/A'
          };

          traitsList.innerHTML = `
            <li>origin<span>${traitsData.origin}</span></li>
            <li>character<span>${traitsData.character}</span></li>
            <li>child friendly<span>${traitsData.childFriendly}</span></li>
            <li>dog friendly<span>${traitsData.dogFriendly}</span></li>
            <li>energy level<span>${traitsData.energyLevel}</span></li>
          `;

          if (mobileSection && !mobileSection.querySelector('.description')) {
            mobileSection.innerHTML = `
              <div class="description">
                <div class="text">
                  <h2>${data.prediction}</h2>
                  <p>${cleanDescription}</p>
                </div>
                <img id="mobile-cat-img" src="" alt="Cat" loading="lazy" />
              </div>
              <h3>Traits</h3>
              <ul>
                <li>origin<span>${traitsData.origin}</span></li>
                <li>character<span>${traitsData.character}</span></li>
                <li>child friendly<span>${traitsData.childFriendly}</span></li>
                <li>dog friendly<span>${traitsData.dogFriendly}</span></li>
                <li>energy level<span>${traitsData.energyLevel}</span></li>
              </ul>
              <button class="nav-button animation-reveal" data-index="1">scan more</button>
            `;
            bindMobileNavButtons();
          }

          if (breed?.reference_image_id) {
            const imgSrc = `https://cdn2.thecatapi.com/images/${breed.reference_image_id}.jpg`;
            imageEl.src = imgSrc;
            const mobileImg = document.getElementById('mobile-cat-img');
            if (mobileImg) mobileImg.src = imgSrc;
          }

          slider.slideTo(3);

        } catch (err) {
          console.error('Cat API error:', err);
          descriptionEl.textContent = 'N/A';
          slider.slideTo(3);
        }

      }, waitTime);

    } catch (err) {
      alert('Error uploading image.');
      console.error(err);
      slider.slideTo(1);
      if (cursorEl && slider.currentIndex === 1) cursorEl.style.opacity = '1';
    }
  });
}