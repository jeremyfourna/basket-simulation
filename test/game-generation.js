const chai = require('chai');
const { generateGame, initGame, initPlayers } = require('../src/game-generation');
chai.use(require('chai-json-schema'));

const assert = chai.assert;

//////////////////
// JSON Schema //
////////////////

const playerProps = {
  id: {
    type: 'number'
  },
  name: {
    type: 'string',
  },
  charact: {
    type: 'object',
    properties: {
      ft: {
        type: 'number',
        minimum: 0,
        maximum: 100
      },
      twoPts: {
        type: 'number',
        minimum: 0,
        maximum: 100
      },
      threePts: {
        type: 'number',
        minimum: 0,
        maximum: 100
      }
    }
  },
  stats: {
    type: 'object',
    properties: {
      ft: {
        type: 'array',
        minItems: 2,
        maxItems: 2,
        items: {
          type: 'number',
          minimum: 0,
        }
      },
      twoPts: {
        type: 'array',
        minItems: 2,
        maxItems: 2,
        items: {
          type: 'number',
          minimum: 0,
        }
      },
      threePts: {
        type: 'array',
        minItems: 2,
        maxItems: 2,
        items: {
          type: 'number',
          minimum: 0,
        }
      }
    }
  }
};

const playerSchema = {
  title: 'player schema returned by initPlayers() v1',
  type: 'object',
  required: [
    'id',
    'name',
    'charact',
    'stats'
  ],
  properties: playerProps
};

const initPlayersSchema = {
  title: 'Array of teams and players returned by initPlayers() v1',
  type: 'array',
  minItems: 2,
  maxItems: 2,
  items: {
    type: 'array',
    minItems: 5,
    maxItems: 16,
    items: {
      type: 'object',
      properties: playerProps
    }
  }
}

const gameConfigSchema = {
  title: 'config schema for initGame() v1',
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
      enum: ['nba', 'fiba']
    },
    teamsSpeed: {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      items: {
        type: 'string',
        enum: ['fast', 'normal', 'slow']
      }
    },
    teamsName: {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      items: {
        type: 'string',
      }
    },
    players: {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      items: {
        type: 'array',
        minItems: 5,
        maxItems: 16,
        items: {
          type: 'object',
          properties: playerProps
        }
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
      maxItems: 2,
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

const gameSchema = {
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
      enum: ['nba', 'fiba']
    },
    teamsSpeed: {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      items: {
        type: 'string',
        enum: ['fast', 'normal', 'slow']
      }
    },
    teamsName: {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      items: {
        type: 'string',
      }
    },
    players: {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      items: {
        type: 'array',
        minItems: 5,
        maxItems: 16,
        items: {
          type: 'object',
          properties: playerProps
        }
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
      maxItems: 2,
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
}

describe('game-generation.js', () => {
  describe('Function initGame()', () => {
    const gameConfig = [
      'nba', ['fast', 'fast'],
      ['New York Knicks', 'Boston Celtics']
    ];
    it('initGame() must return a valid gameConfigSchema', () => {
      assert.jsonSchema(initGame(...gameConfig, initPlayers()), gameConfigSchema);
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
  });
});
