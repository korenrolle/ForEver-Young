const symbols = [
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '🧸',
  '💊',
  '💸',
  '🖍',
  '📟',
  '⏳',
  '📸',
  '🎙'
];

let firstSpace = document.getElementById('square1');
let secondSpace = document.getElementById('square2');
let thirdSpace = document.getElementById('square3');
// let randomNumber = Math.floor(Math.random() * 13);

// for (let i > 0; i < symbols.length; i++) {
//   const j = Math.floor(Math.random() * (i + 1));
//   [array[i], array[j]] = [array[j], array[i]];
// }

let randomNumber = Math.floor(Math.random() * symbols.length);
console.log(symbols);
let randomNumber2 = Math.floor(Math.random() * symbols.length);
console.log(randomNumber2);
let randomNumber3 = Math.floor(Math.random() * symbols.length);
console.log(randomNumber3);

let milliondollarvariable = 1000000;
const screen = document.querySelectorAll('.box');
const btn = document.querySelector('.spinner');
const betMax = document.querySelector('.max');
const screenArr = Array.from(screen);
const empty = document.getElementById('endGame');
const empty2 = document.getElementById('subtract');
const postiveWord = document.getElementById('positive');
const winDisplay = document.getElementById('win');
function getRandom() {
  // s = Math.floor(Math.random() * symbols.length);
}
btn.addEventListener('click', () => {
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

  console.log(j);
  console.log(n);
  getRandom();
  (numberPlace = document.getElementById('numberPlace')),
    (milliondollarvariable = milliondollarvariable - 10000);
  numberPlace.innerHTML = milliondollarvariable;
  if (milliondollarvariable < 10000) {
    empty2.className = 'noClick';
    empty.className = 'noClick';
    console.log('your out of money');
  }
  if (
    firstSpace.innerHTML === secondSpace.innerHTML &&
    firstSpace.innerHTML === thirdSpace.innerHTML
  ) {
    // winDisplay.innerHTML = 'Winner';
    winDisplay.innerHTML = 'Winner';

    console.log('I win');
  }
});

postiveWord.addEventListener('click', () => {
  window.alert(
    'The way the wind blows will is consistent, the direction is not'
  );
});

// number = 0, /// number value
// min = 1, /// min number
// if (number > min) {
//   number = number - 10000; /// Minus 1 of the number
//   numberPlace.innerText = number; /// Display the value in place of the number
// }
// if (numberPlace < 10000) {
//   console.log('Your out of Money');
// }
// console.log(firstSpace);
// console.log(secondSpace);
// console.log(thirdSpace);

betMax.addEventListener(
  'click',
  () => {
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
      console.log('I win');
    }
  }

  // //     for (i = 0; i < symbolChances[currentSymbol]; i++)
  //       symbolChances[symbolChances.length] = symbols[currentSymbol];
  //     currentsymbol++;
  //         row.className = 'noClick1';
  //         row.innerHTML = player1;
  //         win();
  //         currentChoice = 2;
  //         winner1.push(index);
  //   console.log('winner1');
  //       } else if (currentChoice == 2) {
  //         row.className = 'noClick2';
  //         row.innerHTML = player2;
  //         win();
  //         currentChoice = 1;
  //         winner2.push(index);
  //         console.log(winner2);
  //       }
);
