const Player = (sign) => {
  return {
    sign: sign,  // Store the sign
    getSign: () => sign  // Define a getSign method
  };
};

//functions related to the Game Board
const gameBoard = () => {
  const board = new Array(9).fill(undefined);

  const getBoard = () => board;
  
  const dropToken = (index, sign) => {
    if (board[index] === undefined) {
    board[index] = sign;
  } else {
    console.log("This field is already taken")
  }
  }

  const getToken = (index) => board[index];

  const resetBoard = () => {
    for (i = 0; i < board.length; i++) {
      board[i] = undefined;
    }
  }
  return { getBoard, dropToken, getToken, resetBoard }
}

//function related to controlling the game
const gameControls = () => {
  const player1 = Player("x");
  const player2 = Player("o");
  const board = gameBoard();

  let activePlayer = player1;
  let round = 0;

  const getRound = () => round; 

  const switchPlayer = () => {
    activePlayer = (activePlayer === player1) ? player2 : player1;
  }

  const getActivePlayer = () => activePlayer;

  const playRound = (index) => {
    console.log(`${getActivePlayer().sign} puts his tokken on the number ${index}`);
    board.dropToken(index, getActivePlayer().getSign());
    console.log(board.getBoard());

    const winner = checkWin(board.getBoard());
    if (winner) {
      console.log(`Player ${winner} wins!`);
      board.resetBoard();
      round = 0;
    } else {
      if (round === 9) {
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
      // Horizontal
      [0, 1, 2],  // top row
      [3, 4, 5],  // middle row
      [6, 7, 8],  // bottom row
      // Vertical
      [0, 3, 6],  // left column
      [1, 4, 7],  // middle column
      [2, 5, 8],  // right column
      // Diagonal
      [0, 4, 8],  // top-left to bottom-right
      [2, 4, 6]   // top-right to bottom-left
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; //return winning sign
      }
    }
    return null; //no winner
  }

  return { playRound, switchPlayer, getActivePlayer, getRound, checkWin };
}


const game = gameControls();
while (game.getRound() < 9) {
  game.playRound(prompt(`Player ${game.getActivePlayer().sign}, choose a number between 0 and 8`));
}