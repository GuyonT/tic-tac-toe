const Player = (sign) => {
  return {
    sign: sign,
    getSign: () => sign
  };
};

const gameBoard = () => {
  const board = new Array(9).fill(undefined);

  const getBoard = () => board;
  
  const dropToken = (index, sign) => {
    if (board[index] === undefined) {
      board[index] = sign;
    } else {
      console.log("This square is already taken")
    }
  }

  const getToken = (index) => board[index];

  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = undefined;
    }
  }
  
  return { getBoard, dropToken, getToken, resetBoard }
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

  const playRound = (index) => {
    console.log(`${getActivePlayer().sign} puts their token on square ${index}`);
    board.dropToken(index, getActivePlayer().getSign());
    console.log(board.getBoard());

    const winner = checkWin(board.getBoard());
    if (winner) {
      console.log(`Player ${winner} wins!`);
      board.resetBoard();
      round = 0;
    } else {
      if (round === 8) { 
        console.log("It's a draw!");
        board.resetBoard();
        round = 0;
      } else {
        round++;
        switchPlayer();
        console.log(`Round ${round}`);
      }
    }
  }

  const checkWin = (board) => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
      [0, 4, 8], [2, 4, 6]             // Diagonal
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
    getBoard  
  };
}

const displayControls = () => {
  const game = gameControls();
  const boardDiv = document.querySelector('.board');
  const statusDiv = document.querySelector('.status');
  
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
          game.playRound(index);
          
          updateDisplay();
          updateStatus();
          
          const winner = game.checkWin(game.getBoard().getBoard());
          
          if (winner) {
            statusDiv.textContent = `Player ${winner} wins!`;
            setTimeout(() => {
              game.getBoard().resetBoard();
              updateDisplay();
              updateStatus();
            }, 1500);
          } else if (game.getRound() === 9) {
            statusDiv.textContent = "It's a draw!";
            setTimeout(() => {
              game.getBoard().resetBoard();
              updateDisplay();
              updateStatus();
            }, 1500);
          }
        }
      });
      
      boardDiv.appendChild(squareDiv);
    });
  };
  
  updateDisplay();
  updateStatus();
};

// Start the game
displayControls();