const {
  generateGame,
  initGame,
  initPlayers
} = require('./src/game-generation');
const {boxscore} = require('./src/boxscore');

exports.generateGame = generateGame;
exports.initGame = initGame;
exports.initPlayers = initPlayers;
exports.boxscore = boxscore;
