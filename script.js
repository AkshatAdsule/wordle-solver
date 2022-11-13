const colors = [
  "rgb(58, 58, 60)", // grey
  "rgb(181, 159, 59)", // yellow
  "rgb(83, 141, 78)", // green
];

const states = ["banned", "unverified", "verified"];
const startingWord = "crane";

let candidateWords = WORDS;
const verifiedLetters = [];
const unverifiedLetters = [];
const bannedLetters = [];

let currentStep = -1;

// Generate grid
window.onload = function () {
  const grid = document.getElementById("grid");

  for (let i = 0; i < 6; i++) {
    let rowHTML = `<div class="row">`;
    for (let j = 0; j < 5; j++) {
      rowHTML += `<div id="${i}${j}" class="square" onclick="handleClick(${
        i * 10 + j
      })"></div>`;
    }
    rowHTML += `</div>`;
    grid.innerHTML += rowHTML;
  }
};

// next button handler
document.getElementById("next").addEventListener("click", function () {
  if (currentStep == -1) {
    for (let i = 0; i < 5; i++) {
      document.getElementById(`0${i}`).innerText = startingWord[i];
    }
    currentStep++;
    return;
  }

  for (let i = 0; i < 5; i++) {
    let square = document.getElementById(`${currentStep}${i}`);
    let buttonState = square.dataset.state;
    switch (buttonState) {
      case "unverified":
        unverifiedLetters.push({
          index: i,
          letter: square.innerText.toLowerCase(),
        });
        break;
      case "banned":
        bannedLetters.push(square.innerText.toLowerCase());
        break;
      case "verified":
        verifiedLetters.push({
          index: i,
          letter: square.innerText.toLowerCase(),
        });
    }
  }
  processWords();
});

// grid clicked handler
function handleClick(target) {
  let row = Math.floor(target / 10);
  if (row != currentStep) {
    return;
  }
  let column = target % 10;
  let square = document.getElementById(`${row}${column}`);
  let index = colors.indexOf(square.style.backgroundColor);
  if (++index > 2) {
    index -= 3;
  }
  square.style.backgroundColor = colors[index];
  square.dataset.state = states[index];
}

function processWords() {
  for (let i = 0; i < candidateWords.length; i++) {
    let word = candidateWords[i];
    let hasFailed = false;
    for (const letter of bannedLetters) {
      if (word.indexOf(letter) != -1) {
        hasFailed = true;
        break;
      }
    }

    if (!hasFailed) {
      for (const letter of unverifiedLetters) {
        if (
          word.indexOf(letter.letter) == letter.index ||
          word.indexOf(letter.letter) == -1
        ) {
          hasFailed = true;
          break;
        }
      }

      if (!hasFailed) {
        for (const letter of verifiedLetters) {
          if (!(word.indexOf(letter.letter) == letter.index || word.lastIndexOf(letter.letter) == letter.index)) {
            hasFailed = true;
            break;
          }
        }
      }
    }

    if (hasFailed) {
      candidateWords.splice(i, 1);
      i--;
    }
  }
  let nextWord =
    candidateWords[Math.floor(candidateWords.length * Math.random())];
  let nextStep = currentStep + 1;
  for (let j = 0; j < 5; j++) {
    let square = document.getElementById(`${nextStep}${j}`);
    square.innerText = nextWord[j];
  }
  currentStep++;
}
