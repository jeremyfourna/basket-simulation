const {
  generateGame,
  initGame,
  initPlayers
} = require('./src/game-generation');
const { boxscore } = require('./src/boxscore');

/*
const gameConfig = [
  'nba', ['fast', 'fast'],
  ['New York Knicks', 'Boston Celtics']
];
console.log(generateGame(initGame(...gameConfig, initPlayers())));
*/
exports.generateGame = generateGame;
exports.initGame = initGame;
exports.initPlayers = initPlayers;
exports.boxscore = boxscore;
