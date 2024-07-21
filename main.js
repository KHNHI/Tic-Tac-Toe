const cells = document.querySelectorAll(".cell");
const popUp = document.querySelector(".popup");
const playAgainBtn = document.querySelector("#play_again");
const restartBtn = document.querySelector("#restart");
const message = document.querySelector("#message");

// Winning Pattern Array
let winningPattern = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
  [0, 4, 8, 12],
  [1, 2, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
  [0, 5, 10, 15],
  [3, 6, 9, 12],
];

// Player "X" plays first
let xTurn = true;
let count = 0;
// Win Condition
const winChecker = () => {
  // Loop through all win pattern
  for (let i of winningPattern) {
    const [elm1, elm2, elm3, elm4] = [
      cells[i[0]].innerText,
      cells[i[1]].innerText,
      cells[i[2]].innerText,
      cells[i[3]].innerText,
    ];
    // If elm are filled
    if (elm1 != "" && elm2 != "" && elm3 != "" && elm4 != "") {
      if (elm1 === elm2 && elm2 === elm3 && elm3 === elm4) {
        winFunction(elm1);
      }
    }
  }
};
// This is winFunction(which will executed when a player wins)
const winFunction = (letter) => {
  disableButtons();
  if (letter === "X") {
    message.innerHTML = "&#x1F389; <br> 'X' is the real Winner";
  } else {
    message.innerHTML = "&#x1F389; <br> 'O' is the real Winner";
  }
};
//The function for Drawing
const drawFunction = () => {
  disableButtons();
  message.innerHTML = "&#x1f60e; <br> It's a draw!!!";
};
// Disable all cells buttons and unhide the popup
const disableButtons = () => {
  cells.forEach((cell) => (cell.disabled = true));
  //   enable popup
  popUp.classList.remove("hide");
};

// Display X/O on click
cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    if (xTurn) {
      xTurn = false;
      //Display X
      cell.innerText = "X";
      cell.disabled = true;
    } else {
      xTurn = true;
      //   Display O
      cell.textContent = "O";
      cell.disabled = true;
    }
    // Increment count
    count += 1;
    if (count === 16) {
      // Will be a draw
      drawFunction();
    }
    // Winning Condition
    winChecker();
  });
});

// For "Play again" and " restart" button
const enableButton = () => {
  cells.forEach((cell) => {
    cell.innerText = "";
    cell.disabled = false;
  });
  popUp.classList.add("hide");
};
// Play again button
playAgainBtn.addEventListener("click", () => {
  count = 0;
  enableButton();
});
restartBtn.addEventListener("click", () => {
  count = 0;
  enableButton();
});

// window.onload = enableButton;
