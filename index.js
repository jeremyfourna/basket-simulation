const { generateGame, initGame, initPlayers } = require('./src/game-generation');
const { boxscore } = require('./src/boxscore');

//const gameConfig = ['fiba', ['normal', 'normal']];

//const game = generateGame(initGame(...gameConfig, initPlayers()));

//const gameStats = boxscore(game);

exports.generateGame = generateGame;
exports.initGame = initGame;
exports.initPlayers = initPlayers;
exports.boxscore = boxscore;
