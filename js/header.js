const chairs = document.querySelectorAll('.chair');
function changeNormal(chairs) {
  const randomIndex = Math.floor(Math.random() * 5);
  chairs.forEach((chair, index) => {
    if (index === randomIndex) chair.querySelector('.chair-norm').classList.add('is-norm');
    else chair.querySelector('.chair-done').classList.add('is-done')
  })
}
changeNormal(chairs);
chairs.forEach((chair) => {
  chair.addEventListener('click', () => {
    if (chair.querySelector('.chair-norm').classList.contains('is-norm')) {
      chair.querySelector('.chair-norm').classList.remove('is-norm');
      changeNormal(chairs)
      return;
    } 
  })
})