const cells = document.querySelectorAll(".cell");
const popUp = document.querySelector(".popup");
const playAgainBtn = document.querySelector("#play_again");
const restartBtn = document.querySelector("#restart");
const backToMenuBtn = document.querySelector("#backToMenu");
const message = document.querySelector("#message");
const modeSelection = document.querySelector("#modeSelection");
const gameContainer = document.querySelector("#gameContainer");
const gameInfo = document.querySelector("#gameInfo");
const currentPlayerDisplay = document.querySelector("#currentPlayer");
const gameModeDisplay = document.querySelector("#gameMode");
const gameTimerDisplay = document.querySelector("#gameTimer");
const twoPlayerModeBtn = document.querySelector("#twoPlayerMode");
const aiPlayerModeBtn = document.querySelector("#aiPlayerMode");

// Game mode variables
let isAIMode = false;
let currentPlayer = "X";

// Timer variables
let gameStartTime = null;
let gameTimer = null;
let gameDuration = 0;

// Winning Pattern Array (4x4 grid)
let winningPattern = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
  [0, 4, 8, 12],
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
  [0, 5, 10, 15],
  [3, 6, 9, 12],
];

// Player "X" plays first
let humanPlayer = "X";
let aiPlayer = "O";
let board = Array(16).fill("");
let gameOver = false;

// Win Condition
const winChecker = (bd) => {
  // Loop through all win pattern
  for (let i of winningPattern) {
    const [elm1, elm2, elm3, elm4] = i;
    // If elm are filled
    if (
      bd[elm1] &&
      bd[elm1] === bd[elm2] &&
      bd[elm1] === bd[elm3] &&
      bd[elm1] === bd[elm4]
    ) {
      return bd[elm1];
    }
  }
  if (bd.every((cell) => cell !== "")) return "draw";
  return null;
};

// This is winFunction(which will executed when a player wins)
const winFunction = (letter) => {
  stopGameTimer();
  disableButtons();
  const finalTime = gameTimerDisplay.textContent.split(": ")[1];
  if (letter === "X") {
    message.innerHTML = `&#x1F389; <br> 'X' is the real Winner<br><small>Time: ${finalTime}</small>`;
  } else {
    message.innerHTML = `&#x1F389; <br> 'O' is the real Winner<br><small>Time: ${finalTime}</small>`;
  }
};

//The function for Drawing
const drawFunction = () => {
  stopGameTimer();
  disableButtons();
  const finalTime = gameTimerDisplay.textContent.split(": ")[1];
  message.innerHTML = `&#x1f60e; <br> It's a draw!!!<br><small>Time: ${finalTime}</small>`;
};

// Disable all cells buttons and unhide the popup
const disableButtons = () => {
  const currentCells = document.querySelectorAll(".cell");
  currentCells.forEach((cell) => (cell.disabled = true));
  //   enable popup
  popUp.classList.remove("hide");
};

// Update current player display
const updateCurrentPlayerDisplay = () => {
  if (currentPlayerDisplay) {
    currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
  }
};

// Timer functions
const startGameTimer = () => {
  gameStartTime = Date.now();
  gameDuration = 0;
  updateTimerDisplay();

  gameTimer = setInterval(() => {
    gameDuration = Math.floor((Date.now() - gameStartTime) / 1000);
    updateTimerDisplay();
  }, 1000);
};

const stopGameTimer = () => {
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
};

const updateTimerDisplay = () => {
  if (gameTimerDisplay) {
    const minutes = Math.floor(gameDuration / 60);
    const seconds = gameDuration % 60;
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    gameTimerDisplay.textContent = `⏱️ Time: ${formattedTime}`;
  }
};

const resetTimer = () => {
  stopGameTimer();
  gameDuration = 0;
  if (gameTimerDisplay) {
    gameTimerDisplay.textContent = "⏱️ Time: 00:00";
  }
};

// For "Play again" and "restart" button
const enableButton = () => {
  board = Array(16).fill("");
  gameOver = false;
  currentPlayer = "X";
  const currentCells = document.querySelectorAll(".cell");
  currentCells.forEach((cell) => {
    cell.innerText = "";
    cell.disabled = false;
  });
  popUp.classList.add("hide");
  updateCurrentPlayerDisplay();
  resetTimer();
  startGameTimer();
};

// Mode selection functions
const startTwoPlayerMode = () => {
  isAIMode = false;
  gameModeDisplay.textContent = "Mode: Two Players";
  showGameBoard();
};

const startAIMode = () => {
  isAIMode = true;
  gameModeDisplay.textContent = "Mode: Player vs AI";
  showGameBoard();
};

const showGameBoard = () => {
  modeSelection.style.display = "none";
  gameContainer.style.display = "block";
  gameInfo.style.display = "block";
  restartBtn.style.display = "inline-block";
  backToMenuBtn.style.display = "inline-block";

  // Create board HTML
  gameContainer.innerHTML = `
    <div class="board">
      ${Array(16)
        .fill()
        .map(() => '<button class="cell"></button>')
        .join("")}
    </div>
  `;

  // Re-query cells after creating them
  const newCells = document.querySelectorAll(".cell");
  initializeGame(newCells);
  updateCurrentPlayerDisplay();
  resetTimer();
  startGameTimer();
};

const backToMenu = () => {
  stopGameTimer();
  modeSelection.style.display = "block";
  gameContainer.style.display = "none";
  gameInfo.style.display = "none";
  restartBtn.style.display = "none";
  backToMenuBtn.style.display = "none";
  popUp.classList.add("hide");
  enableButton();
};

// Play again button
playAgainBtn.addEventListener("click", () => {
  enableButton();
});

restartBtn.addEventListener("click", () => {
  enableButton();
});

backToMenuBtn.addEventListener("click", () => {
  backToMenu();
});

// Mode selection event listeners
twoPlayerModeBtn.addEventListener("click", startTwoPlayerMode);
aiPlayerModeBtn.addEventListener("click", startAIMode);

//Implement optimized AI for 4x4 tic-tac-toe
const minimax = (
  board,
  depth,
  isMaximizing,
  alpha = -Infinity,
  beta = Infinity,
  maxDepth = 6
) => {
  let result = winChecker(board);
  if (result === aiPlayer) return 10 - depth;
  if (result === humanPlayer) return depth - 10;
  if (result === "draw") return 0;
  if (depth >= maxDepth) return 0; // Limit search depth

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 16; i++) {
      if (board[i] === "") {
        board[i] = aiPlayer;
        let score = minimax(board, depth + 1, false, alpha, beta, maxDepth);
        board[i] = "";
        bestScore = Math.max(bestScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 16; i++) {
      if (board[i] === "") {
        board[i] = humanPlayer;
        let score = minimax(board, depth + 1, true, alpha, beta, maxDepth);
        board[i] = "";
        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
    }
    return bestScore;
  }
};

// Simple AI strategy for better performance
const getAIMove = () => {
  // 1. Try to win
  for (let i = 0; i < 16; i++) {
    if (board[i] === "") {
      board[i] = aiPlayer;
      if (winChecker(board) === aiPlayer) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  // 2. Block human from winning
  for (let i = 0; i < 16; i++) {
    if (board[i] === "") {
      board[i] = humanPlayer;
      if (winChecker(board) === humanPlayer) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  // 3. Use minimax for remaining moves (with limited depth)
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 16; i++) {
    if (board[i] === "") {
      board[i] = aiPlayer;
      let score = minimax(board, 0, false, -Infinity, Infinity, 4);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
};

const bestMove = () => {
  console.log("AI is thinking..."); // Debug

  let move = getAIMove();

  if (move !== undefined) {
    board[move] = aiPlayer;
    const currentCells = document.querySelectorAll(".cell");
    currentCells[move].innerText = aiPlayer;
    currentCells[move].disabled = true;
    console.log("AI played at position:", move); // Debug
  }

  // Check for win condition after AI move
  let result = winChecker(board);
  if (result) {
    gameOver = true;
    if (result === "draw") {
      drawFunction();
    } else {
      winFunction(result);
    }
  }
};

// Initialize game - Add event listeners to cells
const initializeGame = (cellElements) => {
  cellElements.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      console.log("Cell clicked:", index); // Debug
      if (board[index] === "" && !gameOver) {
        if (isAIMode) {
          // AI Mode: Human vs AI
          if (currentPlayer === humanPlayer) {
            // Human player move
            board[index] = humanPlayer;
            cell.innerText = humanPlayer;
            cell.disabled = true;

            // Check for win condition after human move
            let result = winChecker(board);
            if (result) {
              gameOver = true;
              if (result === "draw") {
                drawFunction();
              } else {
                winFunction(result);
              }
              return;
            }

            // Switch to AI turn
            currentPlayer = aiPlayer;
            updateCurrentPlayerDisplay();

            // AI move
            setTimeout(() => {
              bestMove();
              currentPlayer = humanPlayer;
              updateCurrentPlayerDisplay();
            }, 300);
          }
        } else {
          // Two Player Mode
          board[index] = currentPlayer;
          cell.innerText = currentPlayer;
          cell.disabled = true;

          // Check for win condition
          let result = winChecker(board);
          if (result) {
            gameOver = true;
            if (result === "draw") {
              drawFunction();
            } else {
              winFunction(result);
            }
            return;
          }

          // Switch player
          currentPlayer = currentPlayer === "X" ? "O" : "X";
          updateCurrentPlayerDisplay();
        }
      }
    });
  });
};

console.log("Game initialized"); // Debug
