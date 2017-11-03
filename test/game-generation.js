const R = require('ramda');
const chai = require('chai');
const {
  generateGame,
  initGame,
  initPlayers
} = require('../src/game-generation');
const {
  initPlayersSchema,
  gameSchema,
  gameConfigSchema
} = require('./schema');

chai.use(require('chai-json-schema'));

const assert = chai.assert;

describe('game-generation.js', () => {
  describe('Function initGame()', () => {
    it('initGame() must return a valid gameConfigSchema for NBA game', () => {
      const gameConfig = [
        'nba', ['fast', 'fast'],
        ['New York Knicks', 'Boston Celtics']
      ];
      assert.jsonSchema(initGame(...gameConfig, initPlayers()), gameConfigSchema);
    });
    it('initGame() must return a valid gameConfigSchema for FIBA game', () => {
      const gameConfig = [
        'fiba', ['fast', 'fast'],
        ['New York Knicks', 'Boston Celtics']
      ];
      assert.jsonSchema(initGame(...gameConfig, initPlayers()), gameConfigSchema);
    });
    it('initGame() should not allow an unsupported game style', () => {
      const gameConfig = [
        'streetGame', ['fast', 'fast'],
        ['New York Knicks', 'Boston Celtics']
      ];
      assert.equal(initGame(...gameConfig, initPlayers()), `We only know nba or fiba as basket-ball style, ${R.head(gameConfig)} is unknown`);
    });
  });
  describe('Function initPlayers()', () => {
    it('initPlayers() must return a valid initPlayersSchema', () => {
      assert.jsonSchema(initPlayers(), initPlayersSchema);
    });
  });
  describe('Function generateGame()', () => {
    it('generateGame() must return a valid gameSchema', () => {
      const gameConfig = [
        'nba', ['fast', 'fast'],
        ['New York Knicks', 'Boston Celtics']
      ];
      assert.jsonSchema(generateGame(initGame(...gameConfig, initPlayers())), gameSchema);
    });
    it('If game end with a tie, there will be an overtime', () => {
      const gameConfig = [
        'nba', ['fast', 'fast'],
        ['New York Knicks', 'Boston Celtics']
      ];
      const configAfterNormalGame = generateGame(initGame(...gameConfig, initPlayers()));
      const newConfigForOvertime = R.assoc('score', [100, 100], configAfterNormalGame);
      assert.isTrue(R.prop('overtime', generateGame(newConfigForOvertime)));
    });
  });
});
