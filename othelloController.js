import othelloCore from './othelloCore.js';

const othelloController = (() => {
  let gameState = {};
  let humanPlayer = 1;
  let aiPlayer = -1;

  function init() {
    gameState = othelloCore.createNewGame();
    return getFullGameState();
  };

  function startNewGame(firstPlayer) {
    gameState = othelloCore.createNewGame();
    humanPlayer = firstPlayer === 'human' ? 1 : -1;
    aiPlayer = -humanPlayer;
    return getFullGameState();
  };

  function handleMove(row, col) {
    if (gameState.currentPlayer !== humanPlayer) return;
    const newState = othelloCore.makeMove(gameState, row, col);
    if (newState === gameState) return;
    gameState = newState;
    return getFullGameState();
  };

  function makeAIMove(config) {
    const move = othelloCore.findBestMove(gameState, config.difficulty);
    if (move) {
      const [row, col] = move;
      gameState = othelloCore.makeMove(gameState, row, col);
      return getFullGameState();
    };
  };

  function getFullGameState() {
    const { board, currentPlayer: player } = gameState;
    return {
      ...gameState,
      validMoves: othelloCore.getAllValidMoves(board, player),
      ...othelloCore.countPieces(board),
      aiShouldPlay: player === aiPlayer,
      message: getStatusMessage()
    };
  };

  function getStatusMessage() {
    const { board, currentPlayer: player } = gameState;
    if (player === 0) {
      const { winner, blackCount, whiteCount } = othelloCore.getGameResult(board);
      if (winner === 0) return `Game Over!\nDraw\n${blackCount} to ${whiteCount}`;
      const isBlack = winner === 1;
      const color = isBlack ? "Black" : "White";
      const playerType = winner === humanPlayer ? "You" : "AI";
      const [winScore, loseScore] = isBlack ?
        [blackCount, whiteCount] :
        [whiteCount, blackCount];
      return `Game Over!\n${color} (${playerType})\nwins\n${winScore} to ${loseScore}`;
    };
    const messages = {
      [humanPlayer]: "Your\nturn",
      [aiPlayer]: "AI is\nthinking..."
    };
    return messages[player] || "Waiting...";
  };

  return {
    init,
    startNewGame,
    handleMove,
    makeAIMove
  };
})();

export default othelloController;
