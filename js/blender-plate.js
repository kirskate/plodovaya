const BLENDER_BY_CARD = {
  1: './assets/blender/apple.svg',
  2: './assets/blender/pear.svg',
  3: './assets/blender/granat.svg',
  4: './assets/blender/cucumber.svg',
  5: './assets/blender/banana.svg',
  6: './assets/blender/strawberry.svg',
  7: './assets/blender/melon.svg',
  8: './assets/blender/grape.svg',
};

function installDrag(fruitEl, blenderEl, plateFruitsEl) {
  let offsetX = 0;
  let offsetY = 0;
  let activePointerId = null;
  let restoreBefore = null;

  function cleanupListeners() {
    fruitEl.removeEventListener('pointermove', onMove);
    fruitEl.removeEventListener('pointerup', onUp);
    fruitEl.removeEventListener('pointercancel', onUp);
  }

  function onMove(e) {
    fruitEl.style.left = `${e.clientX - offsetX}px`;
    fruitEl.style.top = `${e.clientY - offsetY}px`;
  }

  function putBackInPlate() {
    if (fruitEl.parentNode !== plateFruitsEl) {
      plateFruitsEl.insertBefore(fruitEl, restoreBefore);
    }
    restoreBefore = null;
  }

  function onUp(e) {
    cleanupListeners();
    if (activePointerId !== null) {
      try {
        fruitEl.releasePointerCapture(activePointerId);
      } catch {
      }
      activePointerId = null;
    }

    if (!fruitEl.classList.contains('is-dragging')) return;
    fruitEl.classList.remove('is-dragging');

    const br = blenderEl.getBoundingClientRect();
    const pad = 28;
    const cx = e.clientX;
    const cy = e.clientY;
    const inBlender =
      cx >= br.left - pad &&
      cx <= br.right + pad &&
      cy >= br.top - pad &&
      cy <= br.bottom + pad;

    if (inBlender) {
      const fr = fruitEl.getBoundingClientRect();
      const targetLeft = br.left + br.width / 2 - fr.width / 2;
      const targetTop = br.top + br.height / 2 - fr.height / 2;
      fruitEl.style.transition =
        'left 0.38s cubic-bezier(0.4, 0, 0.2, 1), top 0.38s cubic-bezier(0.4, 0, 0.2, 1), transform 0.38s ease, opacity 0.38s ease';
      requestAnimationFrame(() => {
        fruitEl.style.left = `${targetLeft}px`;
        fruitEl.style.top = `${targetTop}px`;
        fruitEl.style.transform = 'scale(0.12)';
        fruitEl.style.opacity = '0';
      });
      window.setTimeout(() => {
        putBackInPlate();
        fruitEl.removeAttribute('style');
        fruitEl.classList.add('dropped');
        fruitEl.style.visibility = 'hidden';
        fruitEl.style.pointerEvents = 'none';
      }, 400);
    } else {
      putBackInPlate();
      fruitEl.removeAttribute('style');
    }
  }

  function onDown(e) {
    if (plateFruitsEl.classList.contains('plate-fruits--empty')) return;
    if (fruitEl.classList.contains('dropped')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    e.preventDefault();
    activePointerId = e.pointerId;
    fruitEl.setPointerCapture(e.pointerId);

    restoreBefore = fruitEl.nextSibling;

    const r = fruitEl.getBoundingClientRect();
    offsetX = e.clientX - r.left;
    offsetY = e.clientY - r.top;

    document.body.appendChild(fruitEl);

    fruitEl.style.position = 'fixed';
    fruitEl.style.left = `${r.left}px`;
    fruitEl.style.top = `${r.top}px`;
    fruitEl.style.width = `${r.width}px`;
    fruitEl.style.height = `${r.height}px`;
    fruitEl.style.zIndex = '10000';
    fruitEl.style.margin = '0';
    fruitEl.style.boxSizing = 'border-box';
    fruitEl.style.transform = '';
    fruitEl.classList.add('is-dragging');

    fruitEl.addEventListener('pointermove', onMove);
    fruitEl.addEventListener('pointerup', onUp);
    fruitEl.addEventListener('pointercancel', onUp);
  }

  fruitEl.addEventListener('pointerdown', onDown);
}

function initBlenderPlate() {
  const blender = document.querySelector('.blender-drop-target');
  const plateFruits = document.querySelector('.plate-fruits');
  const fruits = document.querySelectorAll('.plate-fruit');
  if (!blender || !plateFruits || fruits.length !== 2) return;

  fruits.forEach((fruit) => installDrag(fruit, blender, plateFruits));

  window.addEventListener('plod-fruits:chosen', (e) => {
    const { cards } = e.detail || {};
    if (!Array.isArray(cards) || cards.length !== 2) return;

    fruits.forEach((img, i) => {
      const id = cards[i];
      const src = BLENDER_BY_CARD[id];
      if (!src) return;
      img.src = src;
      img.classList.remove('dropped', 'is-dragging');
      img.removeAttribute('style');
    });

    plateFruits.classList.remove('plate-fruits--empty');
    plateFruits.setAttribute('aria-hidden', 'false');
  });
}

initBlenderPlate();
