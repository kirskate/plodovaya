const FLIP_MS = 600;
const VIEW_MS = 2600;

const COMBO_WORD = {
  '1-2': 'яблогруш',
  '1-3': 'гралоко',
  '1-4': 'огурябло',
  '1-5': 'яблонан',
  '1-6': 'яблоника',
  '1-7': 'яблодыня',
  '1-8': 'яблоград',
  '2-3': 'грангруш',
  '2-4': 'гругурец',
  '2-5': 'банагруш',
  '2-6': 'клугруша',
  '2-7': 'грудыня',
  '2-8': 'виногруш',
  '3-4': 'огургран',
  '3-5': 'гранан',
  '3-6': 'граника',
  '3-7': 'гранадын',
  '3-8': 'гранаград',
  '4-5': 'огурнан',
  '4-6': 'огурника',
  '4-7': 'дыногур',
  '4-8': 'винорец',
  '5-6': 'бананика',
  '5-7': 'бананыня',
  '5-8': 'банаград',
  '6-7': 'клубыня',
  '6-8': 'виноника',
  '7-8': 'винодыня',
};

function pairKey(a, b) {
  const x = Math.min(a, b);
  const y = Math.max(a, b);
  return `${x}-${y}`;
}

function initMenuCards() {
  const catalog = document.getElementById('menuCatalog');
  const productName = document.querySelector('.productName');
  if (!catalog || !productName) return;

  const cards = [...catalog.querySelectorAll('.menu-catalog-card')];
  let firstCard = null;
  let busy = false;

  function setBusy(value) {
    busy = value;
    catalog.classList.toggle('menu-catalog--locked', value);
  }

  function cardId(el) {
    return parseInt(el.dataset.card, 10);
  }

  function scheduleRoundComplete(cardA, cardB) {
    setBusy(true);
    const idA = cardId(cardA);
    const idB = cardId(cardB);
    const word = COMBO_WORD[pairKey(idA, idB)];

    window.setTimeout(() => {
      if (word) productName.textContent = word;
      window.dispatchEvent(
        new CustomEvent('plod-fruits:chosen', {
          detail: { cards: [idA, idB] },
        }),
      );
    }, FLIP_MS);

    window.setTimeout(() => {
      cardA.classList.remove('is-flipped');
      cardB.classList.remove('is-flipped');
      firstCard = null;
      window.setTimeout(() => {
        setBusy(false);
      }, FLIP_MS);
    }, FLIP_MS + VIEW_MS);
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      if (busy) return;
      if (card.classList.contains('is-flipped')) return;

      if (!firstCard) {
        firstCard = card;
        card.classList.add('is-flipped');
        return;
      }

      if (firstCard === card) return;

      card.classList.add('is-flipped');
      scheduleRoundComplete(firstCard, card);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      card.click();
    });
  });
}

initMenuCards();
