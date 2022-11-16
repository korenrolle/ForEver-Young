// // const subtractBtn = document.getElementById('subtract'),
//     numberPlace = document.getElementById('numberPlace'),
//     number = 0, /// number value
//     min = 1, /// min number

//   subtractBtn.onclick = function () {
//     if (number > min) {
//       number = number - 10000; /// Minus 1 of the number
//       numberPlace.innerText = number; /// Display the value in place of the number
//     }
//     if (numberPlace < 10000) {
//       console.log("Your out of Money")
//       // numberPlace.style.color = 'red';
//       // setTimeout(function () {
//       //   numberPlace.style.color = 'black';
//       // }, 500);
//   };
// };
let firstSpace = document.getElementById('square1');
let secondSpace = document.getElementById('square2');
let thirdSpace = document.getElementById('square3');
let randomNumber = Math.floor(Math.random() * 13);

// const symbols = '';
// const symbolChances = [2, 3, 1, 4];
// const totalChances = eval(symbolChances.join('+')); //get total weight (in this case, 10)
// const symbolsArr = new Array(); //new array for symbols
// const currentSymbol = 0;
// while (currentSymbol < symbols.length) {
//   //step through each fruit[] element
// }
// const randomnumber = Math.floor(Math.random() * totalChances);
// console.log(randomnumber);

firstSpace.innerHTML = randomNumber;
secondSpace.innerHTML = randomNumber;
thirdSpace.innerHTML = randomNumber;
// let secondSpace = (document.getElementById('square2').innerHTML = Math.floor(
//   Math.random() * 13
// ));
// let thirdSpace = (document.getElementById('square3').innerHTML = Math.floor(
//   Math.random() * 13
// ));
// const symbols = [];
let milliondollarvariable = 1000000;
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
  milliondollarvariable = milliondollarvariable - 10000;
}
getRandom();
btn.addEventListener('click', () => {
  (numberPlace = document.getElementById('numberPlace')), getRandom();
  milliondollarvariable - 10000;
  numberPlace.innerHTML = milliondollarvariable;

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

  if (
    firstSpace.innerHTML === secondSpace.innerHTML &&
    firstSpace.innerHTML === thirdSpace.innerHTML
  ) {
    console.log('I win');
  }
  // if (milliondollarvariable < 10000) {
  //   return OutOfMoney()
  // }
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
  //     });
});
