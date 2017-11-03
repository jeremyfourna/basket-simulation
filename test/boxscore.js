const chai = require('chai');
const {
  generateGame,
  initGame,
  initPlayers
} = require('../src/game-generation');
const { boxscore } = require('../src/boxscore');
const { boxscoreSchema } = require('./schema');

chai.use(require('chai-json-schema'));

const assert = chai.assert;

describe('boxscore.js', () => {
  describe('Function boxscore()', () => {
    it('boxscore() must return a valid boxscore schema', () => {
      const gameConfig = [
        'nba', ['fast', 'fast'],
        ['New York Knicks', 'Boston Celtics']
      ];
      const endedGame = generateGame(initGame(...gameConfig, initPlayers()));
      assert.jsonSchema(boxscore(endedGame), boxscoreSchema);
    });
  });
});
