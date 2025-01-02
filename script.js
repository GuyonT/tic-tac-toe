const Player = (sign) => {
  return {
      sign: sign,
      getSign: () => sign
  };
};

//functions related to the game board
const gameBoard = () => {
  const board = new Array(9).fill(undefined);

  const getBoard = () => board;

  const dropToken = (index, sign) => { //placing a token on an index
      if (board[index] === undefined) {
          board[index] = sign;
      }
  }

  const getToken = (index) => board[index]; //getting the token on an index

  const resetBoard = () => {
      for (let i = 0; i < board.length; i++) {
          board[i] = undefined;
      }
  }

  return {
      getBoard,
      dropToken,
      getToken,
      resetBoard
  }
}



const gameControls = () => {
  const player1 = Player("\u2715");
  const player2 = Player("\u25EF");
  const board = gameBoard();
  const getBoard = () => board;

  let activePlayer = player1;
  let round = 0;

  const getRound = () => round;

  const switchPlayer = () => {
      activePlayer = (activePlayer === player1) ? player2 : player1;
  }

  const getActivePlayer = () => activePlayer;

  const resetGame = () => {
      round = 0;
      board.resetBoard();
      activePlayer = player1;
  }

  const playRound = (index) => {
      board.dropToken(index, getActivePlayer().getSign());

      const winner = checkWin(board.getBoard());
      if (winner) {
          return {
              gameOver: true,
              winner: winner
          };
      } else if (round === 8) {
          return {
              gameOver: true,
              draw: true
          };
      } else {
          round++;
          switchPlayer();
          return {
              gameOver: false
          };
      }
  }

  const checkWin = (board) => {
      const winningCombinations = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8], // Horizontal
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8], // Vertical
          [0, 4, 8],
          [2, 4, 6] // Diagonal
      ];

      for (const combination of winningCombinations) {
          const [a, b, c] = combination;
          if (board[a] && board[a] === board[b] && board[a] === board[c]) {
              return board[a];
          }
      }
      return null;
  }

  return {
      playRound,
      switchPlayer,
      getActivePlayer,
      getRound,
      checkWin,
      getBoard,
      resetGame
  };
}


const displayControls = () => {
  const game = gameControls();
  const boardDiv = document.querySelector('.board');
  const statusDiv = document.querySelector('.status');
  const titleDiv = document.querySelector('.title');

  const updateStatus = () => {
      statusDiv.textContent = `Player ${game.getActivePlayer().sign}'s turn`;
  };

  const updateDisplay = () => {
      boardDiv.innerHTML = '';

      const currentBoard = game.getBoard().getBoard();

      currentBoard.forEach((squareValue, index) => {
          const squareDiv = document.createElement('div');
          squareDiv.classList.add('square');
          squareDiv.textContent = squareValue || '';

          squareDiv.addEventListener('click', () => {
              if (game.getRound() < 9 && !squareValue) {
                  const gameState = game.playRound(index);
                  updateDisplay();

                  if (gameState.gameOver) {
                      if (gameState.winner) {
                          titleDiv.textContent = `Player ${gameState.winner} wins!`;
                      } else {
                          titleDiv.textContent = "It's a draw!";
                      }
                      disableBoard();
                      showResetButton();
                  } else {
                      updateStatus();
                  }
              }
          });

          boardDiv.appendChild(squareDiv);
      });
  };

  const showResetButton = () => {
      statusDiv.textContent = '';
      const resetButton = document.createElement('button');
      resetButton.id = 'resetButton';
      resetButton.textContent = 'Play Again';
      resetButton.addEventListener('click', () => {
          game.resetGame();
          titleDiv.textContent = "ticTacToe";
          enableBoard();
          updateDisplay();
          updateStatus();
          statusDiv.innerHTML = `Player ${game.getActivePlayer().sign}'s turn`;
      });
      statusDiv.appendChild(resetButton);
  };


  const disableBoard = () => {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.style.pointerEvents = 'none';
    });
};

  const enableBoard = () => {
      const squares = document.querySelectorAll('.square');
      squares.forEach(square => {
          square.style.pointerEvents = 'auto';
      });
  };

  updateDisplay(); //initial display
  updateStatus(); //initial status
};

// Start the game
displayControls();

// Theme switcher
const toggleTheme = () => {
  document.body.dataset.theme = document.body.dataset.theme === "dark" ? "light" : "dark";
}