document.addEventListener('mousemove', (e) => {
  const eyes = document.querySelectorAll('.eye1, .eye2');
  const maxMove = window.innerWidth > 768 ? 70 : 20;

  eyes.forEach(eye => {
    const rect = eye.getBoundingClientRect();

    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;
    
    const dx = e.clientX - eyeCenterX;
    const dy = e.clientY - eyeCenterY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.sqrt(dx*dx + dy*dy);
    const moveDistance = Math.min(maxMove, distance / 15); 

    const x = Math.cos(angle) * moveDistance;
    const y = Math.sin(angle) * moveDistance;

    eye.style.setProperty('--eye-x', `${x}px`);
    eye.style.setProperty('--eye-y', `${y}px`);
  });
});
