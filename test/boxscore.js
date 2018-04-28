const {
  assoc,
  head,
  last,
  map,
  prop,
  range
} = require('ramda');
const chai = require('chai');
const { generatePlayer } = require('basket-simulation-player');
const { boxscore } = require('../src/boxscore.js');
const { generateGame } = require('../src/game-generation.js');
const { boxscoreSchema } = require('./schema');

chai.use(require('chai-json-schema'));

const assert = chai.assert;

describe('boxscore.js', () => {
  describe('Function boxscore()', () => {
    // initTeam :: a -> [object]
    function initTeam() {
      return map(generatePlayer, range(0, 10));
    }
    const gameConfig = {
      style: 'nba',
      teams: [{
        name: 'New York Knicks',
        speed: 'fast',
        players: initTeam()
      }, {
        name: 'Boston Celtics',
        speed: 'fast',
        players: initTeam()
      }]
    };

    it('boxscore() must return a valid boxscoreSchema', () => {
      const gameHistory = prop('history', generateGame(gameConfig));
      assert.jsonSchema(boxscore(gameConfig, gameHistory), boxscoreSchema);
    });
  });

});
