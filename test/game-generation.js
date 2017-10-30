const chai = require('chai');
const { generateGame, initGame, initPlayers } = require('../src/utils');
chai.use(require('chai-json-schema'));

const assert = chai.assert;


describe('game-generation.js', () => {
  describe('Function generateGame()', () => {
    const gameConfigSchema = {
      title: 'config schema for generateGame() v1',
      type: 'object',
      required: [
        'style',
        'teamsSpeed',
        'teamsName',
        'players',
        'history',
        'score',
        'teamWithBall',
        'possessionsPlayed',
        'remainingPossessions'
      ],
      properties: {
        style: {
          type: 'string',
          enum: ['nba', fiba]
        },
        teamsSpeed: {
          type: 'array',
          minItems: 2,
          maxProperties: 2,
          items: {
            type: 'string',
            enum: ['fast', 'normal', 'slow']
          }
        },
        teamsName: {
          type: 'array',
          minItems: 2,
          maxProperties: 2,
          items: {
            type: 'string',
          }
        },
        players: {
          type: 'array',
          minItems: 5,
          maxProperties: 16,
          items: {
            type: 'object'
          }
        },
        history: {
          type: 'array',
          items: {
            type: 'object'
          }
        },
        score: {
          type: 'array',
          minItems: 2,
          maxProperties: 2,
          items: {
            type: 'number',
            minimum: 0
          }
        },
        teamWithBall: {
          type: 'number',
          minimum: 0,
          maximum: 1
        },
        possessionsPlayed: {
          type: 'number',
          minimum: 0
        },
        remainingPossessions: {
          minimum: 0
        }
      }
    };
    it('Must return ft for 1', () => {
      assert.equal('ft', charactForShoot(1));
    });
    it('Must return twoPts for 2', () => {
      assert.equal('twoPts', charactForShoot(2));
    });
    it('Must return threePts for 3', () => {
      assert.equal('threePts', charactForShoot(3));
    });
  });
  describe('Function initGame()', () => {
    const gameConfig = [
      'nba', ['fast', 'fast'],
      ['New York Knicks', 'Boston Celtics']
    ];
    it('Must return ft for 1', () => {
      assert.equal('ft', charactForShoot(1));
    });
    it('Must return twoPts for 2', () => {
      assert.equal('twoPts', charactForShoot(2));
    });
    it('Must return threePts for 3', () => {
      assert.equal('threePts', charactForShoot(3));
    });
  });
});
