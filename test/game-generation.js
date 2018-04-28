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
const {
  change,
  chanceToScore,
  generateGame,
  nbPlaysForGame,
  needOvertime,
  secInGameOrOvertime,
  secInPossessionByStyle,
  typeOfShoot,
  whoWillShoot,
  willScore
} = require('../src/game-generation.js');
const { gameSchema } = require('./schema');

chai.use(require('chai-json-schema'));

const assert = chai.assert;

describe('game-generation.js', () => {
  describe('Function change()', () => {
    it('Must return 1', () => {
      assert.isNumber(change(0));
      assert.equal(change(0), 1);
    });
    it('Must return 0', () => {
      assert.isNumber(change(1));
      assert.equal(change(1), 0);
    });
  });
  describe('Function chanceToScore()', () => {
    it('Must return 0.5 for 90', () => {
      assert.isNumber(chanceToScore(90));
      assert.equal(chanceToScore(90), 0.5);
    });
    it('Must return -0.15 for 0', () => {
      assert.isNumber(chanceToScore(0));
      assert.equal(chanceToScore(0), -0.15);
    });
    it('Must return -1 for a', () => {
      assert.isNumber(chanceToScore('a'));
      assert.equal(chanceToScore('a'), -1);
    });
  });
  describe('Function generateGame()', () => {
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
    it('generateGame() must return a valid gameSchema', () => {
      assert.jsonSchema(generateGame(gameConfig), gameSchema);
    });
    it('generateGame() must return a score > 0', () => {
      const game = generateGame(gameConfig);

      assert.isAbove(head(prop('score', game)), 0);
      assert.isAbove(last(prop('score', game)), 0);
    });
  });
  describe('Function nbPlaysForGame()', () => {
    it('Must return 0 for unknown style', () => {
      const nbPlays = nbPlaysForGame('Jordan', ['fast', 'fast']);

      assert.isNumber(nbPlays);
      assert.equal(nbPlays, 0);
    });
    it('Must return 200 for fiba and [fast, fast]', () => {
      const nbPlays = nbPlaysForGame('fiba', ['fast', 'fast']);

      assert.isNumber(nbPlays);
      assert.equal(nbPlays, 200);
    });
    it('Must return 240 for nba and [fast, fast]', () => {
      const nbPlays = nbPlaysForGame('nba', ['fast', 'fast']);

      assert.isNumber(nbPlays);
      assert.equal(nbPlays, 240);
    });
    it('Must return 25 for overtime and [fast, fast]', () => {
      const nbPlays = nbPlaysForGame('overtime', ['fast', 'fast']);

      assert.isNumber(nbPlays);
      assert.equal(nbPlays, 25);
    });
    it('Must return 214 for nba and [fast, normal]', () => {
      const nbPlays = nbPlaysForGame('nba', ['fast', 'normal']);

      assert.isNumber(nbPlays);
      assert.equal(nbPlays, 214);
    });
    it('Must return 180 for nba and [fast, slow]', () => {
      const nbPlays = nbPlaysForGame('nba', ['fast', 'slow']);

      assert.isNumber(nbPlays);
      assert.equal(nbPlays, 180);
    });
    it('Must return 165 for nba and [normal, slow]', () => {
      const nbPlays = nbPlaysForGame('nba', ['normal', 'slow']);

      assert.isNumber(nbPlays);
      assert.equal(nbPlays, 165);
    });
    it('Must return 192 for nba and [normal, normal]', () => {
      const nbPlays = nbPlaysForGame('nba', ['normal', 'normal']);

      assert.isNumber(nbPlays);
      assert.equal(nbPlays, 192);
    });
    it('Must return 144 for nba and [slow, slow]', () => {
      const nbPlays = nbPlaysForGame('nba', ['slow', 'slow']);

      assert.isNumber(nbPlays);
      assert.equal(nbPlays, 144);
    });
  });
  describe('Function needOvertime()', () => {
    it('Must return true for [50, 50]', () => {
      assert.isTrue(needOvertime([50, 50]));
    });
    it('Must return false for [49, 50]', () => {
      assert.isFalse(needOvertime([49, 50]));
    });
  });
  describe('Function secInGameOrOvertime()', () => {
    it('Must return 2880 for nba', () => {
      assert.isNumber(secInGameOrOvertime('nba'));
      assert.equal(secInGameOrOvertime('nba'), 2880);
    });
    it('Must return 2400 for fiba', () => {
      assert.isNumber(secInGameOrOvertime('fiba'));
      assert.equal(secInGameOrOvertime('fiba'), 2400);
    });
    it('Must return 300 for overtime', () => {
      assert.isNumber(secInGameOrOvertime('overtime'));
      assert.equal(secInGameOrOvertime('overtime'), 300);
    });
    it('Must return 0 for everything else', () => {
      assert.isNumber(secInGameOrOvertime('Jordan'));
      assert.equal(secInGameOrOvertime('Jordan'), 0);
    });
  });
  describe('Function secInPossessionByStyle()', () => {
    it('Must return 12 for fast', () => {
      assert.isNumber(secInPossessionByStyle('fast'));
      assert.equal(secInPossessionByStyle('fast'), 12);
    });
    it('Must return 20 for slow', () => {
      assert.isNumber(secInPossessionByStyle('slow'));
      assert.equal(secInPossessionByStyle('slow'), 20);
    });
    it('Must return 15 for normal', () => {
      assert.isNumber(secInPossessionByStyle('normal'));
      assert.equal(secInPossessionByStyle('normal'), 15);
    });
    it('Must return 24 for everything else', () => {
      assert.isNumber(secInPossessionByStyle('Jordan'));
      assert.equal(secInPossessionByStyle('Jordan'), 24);
    });
  });
  describe('Function typeOfShoot()', () => {
    it('Must return 1', () => {
      assert.isNumber(typeOfShoot(1));
      assert.equal(typeOfShoot(1), 1);
    });
    it('Must return 2', () => {
      assert.isNumber(typeOfShoot(0));
      assert.equal(typeOfShoot(0), 2);
    });
    it('Must return 3', () => {
      assert.isNumber(typeOfShoot(0.75));
      assert.equal(typeOfShoot(0.75), 3);
    });
    it('Must return 1 or 2 or 3', () => {
      assert.isNumber(typeOfShoot());
      assert.oneOf(typeOfShoot(), [1, 2, 3]);
    });
  });
  describe('Function whoWillShoot()', () => {
    it('Must return 1 for [1]', () => {
      const result = whoWillShoot([1]);

      assert.isNumber(result);
      assert.equal(result, 1);
    });
    it('Must return a for [a]', () => {
      const result = whoWillShoot(['a']);

      assert.isString(result);
      assert.equal(result, 'a');
    });
    it('Must return a or b for [a, b]', () => {
      const result = whoWillShoot(['a', 'b']);

      assert.isString(result);
      assert.oneOf(result, ['a', 'b']);
    });
  });
  describe('Function willScore()', () => {
    it('Must return boolean', () => {
      assert.isBoolean(willScore(1, 10));
      assert.isBoolean(willScore(2, 10));
      assert.isBoolean(willScore(3, 10));
      assert.isBoolean(willScore(2, 100));
      assert.isBoolean(willScore(2, 50));
      assert.isBoolean(willScore(2, 90));
      assert.isBoolean(willScore(1, 99));
    });
  });
});
