// This is the array that holds all of my emojis
const symbols = [
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸',
  '📸', // <= one thousand
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟',
  '📟', // <= twenty-five hundred
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍',
  '🖍', //<= five thousand
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸', //<= ten Thousand
  '🎈',
  '🎈',
  '🎈',
  '🎈',
  '🎈',
  '🎈',
  '🎈',
  '🎈',
  '🎈',
  '🎈',
  '🎈',
  '🎈',
  '🎈',
  '🎈', // <= twenty thousand
  '🧪',
  '🧪',
  '🧪',
  '🧪',
  '🧪',
  '🧪',
  '🧪',
  '🧪',
  '🧪',
  '🧪',
  '🧪', // <= thirty thousand
  '🌡',
  '🌡',
  '🌡',
  '🌡',
  '🌡',
  '🌡',
  '🌡',
  '🌡',
  '🌡',
  '🌡',
  '🌡',
  '🌡', // <= forty thousand
  ' 🦠',
  ' 🦠',
  ' 🦠',
  ' 🦠',
  ' 🦠',
  ' 🦠',
  ' 🦠',
  ' 🦠',
  ' 🦠', //<= fifty thousand
  ' 🧬',
  ' 🧬',
  ' 🧬',
  ' 🧬',
  ' 🧬',
  ' 🧬',
  ' 🧬',
  ' 🧬', // <= oneHundred thousand
  '💊',
  '💊',
  '💊',
  '💊',
  '💊',
  '💊',
  '💊', //<= five-hundred thousand
  '💸',
  '💸',
  '💸',
  '💸',
  '💸',
  '💸',
  '💸', //<= small jackpot = seven-hundred fifty thousand
  '⏳', // <= Jackpot = 1 million
  '🎙' // <= mega Jackpot
];
// This is where I targeted each square that holds my emoji (see index.html L22-24)
let firstSpace = document.getElementById('square1');
let secondSpace = document.getElementById('square2');
let thirdSpace = document.getElementById('square3');
//This is where I randomized all of the emojis by there index
let randomNumber = Math.floor(Math.random() * symbols.length);
console.log(symbols);
let randomNumber2 = Math.floor(Math.random() * symbols.length);
console.log(randomNumber2);
let randomNumber3 = Math.floor(Math.random() * symbols.length);
console.log(randomNumber3);
// This is the starting amount that each player is given (see index.html L27)
let milliondollarvariable = 1000000;
// below are some of the divs that I needed to target. I used the DOM. A combination of getElementById and querySelector/querySelectorAll
const screen = document.querySelectorAll('.box');
const btn = document.querySelector('.spinner');
const betMax = document.querySelector('.max');
const empty = document.getElementById('endGame');
const empty2 = document.getElementById('subtract');
const postiveWord = document.getElementById('positive');
const winDisplay = document.getElementById('win');
// This is the function that controls the scroll function. It switched the class to the scroll class(see index.html L38-51)
function getRandom() {
  firstSpace.classList.add('box2');
  secondSpace.classList.add('box2');
  thirdSpace.classList.add('box2');
}
//This is thte event lister connected to the spin button. It is listening in for the click and executing all below on click command
btn.addEventListener('click', () => {
  getRandom();
  randomNumber = Math.floor(Math.random() * symbols.length);
  console.log(symbols);
  randomNumber2 = Math.floor(Math.random() * symbols.length);
  console.log(randomNumber2);
  randomNumber3 = Math.floor(Math.random() * symbols.length);
  console.log(randomNumber3);
  // This is setting a value for the symbols that randomly pop up within the div I created to hold the emojis (see index.html L18-24). I just wanted to make writing it easier.
  const s = symbols[randomNumber];
  const j = symbols[randomNumber2];
  const n = symbols[randomNumber3];
  // This is my for loop that allows my emoji to continue to change. It states that my base number is 0 and I have an array of items. If my array of items(symbols) are greater that 0, then show the symbol in their respective space (see index.html L22-24 main.js L315-317)
  for (let i = 0; i < symbols.length; i++);
  firstSpace.innerHTML = s;
  secondSpace.innerHTML = j;
  thirdSpace.innerHTML = n;
  //This is the area that hold the amount the player has (see index.html L27)
  (numberPlace = document.getElementById('numberPlace')),
    // This is what allows the number place to show decrease, and player amount to decrease everytime player spins. Amount decreases by ten thousand
    (milliondollarvariable = milliondollarvariable - 10000);
  numberPlace.innerHTML = milliondollarvariable;
  // This is my conditional. It states that if milliondollar variable should ever fall below the amount that is needed to spin, freeze everything and tell player they are out of money. I targeted the class names in style.css(L67-69)
  if (milliondollarvariable < 10000) {
    empty2.className = 'noClick';
    empty.className = 'noClick';
    console.log('you are out of money');
  }
  // This is a conditional that states if all of the emojis match that are contained within the innerHTML, tell the player that they won!
  if (
    firstSpace.innerHTML === secondSpace.innerHTML &&
    firstSpace.innerHTML === thirdSpace.innerHTML
  ) {
    // This shows the display winner when playert has won(see index.html L18)
    winDisplay.innerHTML = 'WINNER!';
    milliondollarvariable = milliondollarvariable + 50000;
  }
});
// This is my postive word button. When click an alert will pop up and with a positive word.
postiveWord.addEventListener('click', () => {
  window.alert('The way the wind blows is consistent, the direction is not');
});
// This is my bet max button and everything is pretty much the same as the first button. Will highlight any differences
betMax.addEventListener('click', () => {
  randomNumber = Math.floor(Math.random() * symbols.length);
  console.log(symbols);
  randomNumber2 = Math.floor(Math.random() * symbols.length);
  console.log(randomNumber2);
  randomNumber3 = Math.floor(Math.random() * symbols.length);
  console.log(randomNumber3);
  const s = symbols[randomNumber];
  const j = symbols[randomNumber2];
  const n = symbols[randomNumber3];
  for (let i = 0; i < symbols.length; i++) console.log(s);
  firstSpace.innerHTML = s;
  secondSpace.innerHTML = j;
  thirdSpace.innerHTML = n;
  milliondollarvariable = milliondollarvariable - 50000;
  numberPlace.innerHTML = milliondollarvariable;
  console.log(milliondollarvariable);

  if (milliondollarvariable < 50000) {
    numberPlace = milliondollarvariable;
    milliondollarvariable = milliondollarvariable;
    empty.className = 'noClick';
    empty2.className = 'noClick';
    console.log('your out of money');
  }
  if (
    firstSpace.innerHTML === secondSpace.innerHTML &&
    firstSpace.innerHTML === thirdSpace.innerHTML
  ) {
    winDisplay.innerHTML = 'Winner';
    milliondollarvariable = milliondollarvariable + 50000;
  }
});
