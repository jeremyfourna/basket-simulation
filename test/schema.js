//////////////////
// JSON Schema //
////////////////

const playerProps = {
  id: { type: 'number' },
  name: { type: 'string' },
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
          minimum: 0
        }
      },
      twoPts: {
        type: 'array',
        minItems: 2,
        maxItems: 2,
        items: {
          type: 'number',
          minimum: 0
        }
      },
      threePts: {
        type: 'array',
        minItems: 2,
        maxItems: 2,
        items: {
          type: 'number',
          minimum: 0
        }
      }
    }
  }
};

const gameSchema = {
  title: 'config schema for generateGame() v1',
  type: 'object',
  properties: {
    history: {
      type: 'array',
      items: { type: 'object' }
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
      type: 'number',
      minimum: 0
    },
    overtime: {
      type: 'boolean'
    }
  },
  required: [
    'history',
    'score',
    'teamWithBall',
    'possessionsPlayed',
    'remainingPossessions'
  ]
};

const boxscoreSchema = {
  title: 'config schema for boxscore() v1',
  type: 'object',
  properties: {
    style: {
      type: 'string'
    },
    teams: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          speed: {
            type: 'string'
          },
          players: {
            type: 'array',
            items: playerProps
          }
        }
      }
    }
  }
};


exports.gameSchema = gameSchema;
exports.boxscoreSchema = boxscoreSchema;
