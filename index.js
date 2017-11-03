//const R = require('ramda');
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
const gameEnded = generateGame(initGame(...gameConfig, initPlayers()));

console.log(R.head(R.head(boxscore(gameEnded))));
console.log(R.map(cur => R.prop('stats', cur), R.head(R.prop('players', gameEnded))));
*/

exports.generateGame = generateGame;
exports.initGame = initGame;
exports.initPlayers = initPlayers;
exports.boxscore = boxscore;
