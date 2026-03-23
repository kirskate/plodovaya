const stars = document.querySelectorAll('.star');
const thanksMsg = document.getElementById('thanksMsg');

let isRated = false;

stars.forEach((star, index) => {
  
  star.addEventListener('click', (e) => {
    if (isRated) return;

    isRated = true;

    stars.forEach((s, i) => {
      const redImg = s.querySelector('.star-red');
      if (i <= index) {
        s.classList.add('active');
        redImg.style.opacity = '1';
      } else {
        s.classList.remove('active');
        redImg.style.opacity = '0';
      }
    });

    document.querySelector('.blender-stars').style.cursor = 'default';

    createFirework(e.currentTarget);

    thanksMsg.classList.add('show');
    setTimeout(() => thanksMsg.classList.remove('show'), 2000);
  });

  star.addEventListener('mouseenter', () => {
    if (isRated) return;

    stars.forEach((s, i) => {
      if (i <= index && !s.classList.contains('active')) {
        s.querySelector('.star-red').style.opacity = '0.5';
      }
    });
  });

  star.addEventListener('mouseleave', () => {
    if (isRated) return;

    stars.forEach((s) => {
      if (!s.classList.contains('active')) {
        s.querySelector('.star-red').style.opacity = '0';
      } else {
        s.querySelector('.star-red').style.opacity = '1';
      }
    });
  });

});

function createFirework(target) {
  const rect = target.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2 + window.scrollX;
  const centerY = rect.top + rect.height / 2 + window.scrollY;

  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const angle = (i * 30) * (Math.PI / 180); 
    const velocity = 50 + Math.random() * 50;
    const dx = Math.cos(angle) * velocity + 'px';
    const dy = Math.sin(angle) * velocity + 'px';

    particle.style.setProperty('--dx', dx);
    particle.style.setProperty('--dy', dy);
    
    particle.style.left = centerX + 'px';
    particle.style.top = centerY + 'px';
    particle.style.background = ['#ff4d4d', '#ffec4d', '#ff8a4d'][Math.floor(Math.random() * 3)];

    document.body.appendChild(particle);

    particle.addEventListener('animationend', () => {
      particle.remove();
    });
  }
}