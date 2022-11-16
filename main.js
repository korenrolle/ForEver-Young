// targets - form & subtotal
const form = document.querySelector('#form');
const userInput = document.querySelector('#userInput');
const subtotal = document.querySelector('.sumNumber');
// state / model / global values

// dom update & logic / view
function updateSubtotal(num) {
  subtotal.textContent = num;
}

// handler / controller
form.addEventListener('submit', function (e) {
  e.preventDefault();
  let subValue = Number(subtotal.textContent);
  // grab the current subtotal
  const newValue = Number(userInput.value);
  // grab the value of the user input

  subValue -= newValue;
  // invoke updateSubtotal to update display

  updateSubtotal(subValue);

  this.reset();
  // Alternative Syntax:
  // you can access values from dom elements in a form by accessing the target's elements property.
  console.log(e.target.elements.numInput.value);
  // elements.input - looks for an input field with the name numInput
});
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
  console.log(firstSpace);
  console.log(secondSpace);
  console.log(thirdSpace);

  if (
    firstSpace.innerHTML === secondSpace.innerHTML &&
    firstSpace.innerHTML === thirdSpace.innerHTML
  ) {
    console.log('I win');
  }
  //     for (i = 0; i < symbolChances[currentSymbol]; i++)
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
