const screen = document.querySelectorAll('.box');
const btn = document.querySelector('.spinner');
const screenArr = Array.from(screen);
function getRandom() {
  document.getElementById('square1').innerHTML = Math.floor(Math.random() * 13);
  console.log();
  document.getElementById('square2').innerHTML = Math.floor(Math.random() * 13);
  console.log();
  document.getElementById('square3').innerHTML = Math.floor(Math.random() * 13);
  console.log();
}
getRandom();
btn.addEventListener('click', () => {
  getRandom();
});
