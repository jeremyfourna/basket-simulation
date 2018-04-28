# basket-simulation-game

[![NPM](https://nodei.co/npm/basket-simulation-game.png)](https://www.npmjs.com/package/basket-simulation-game)

## Installation

`npm i basket-simulation-game`

## Usage

### Generate a random game

```js
const { generateGame } = require('basket-simulation-game');

const gameConfig = {
  style: 'nba',
  teams: [{
    name: 'New York Knicks',
    speed: 'fast',
    players: [{...}, {...}] // use basket-simulation-player to generate players
  }, {
    name: 'Boston Celtics',
    speed: 'normal',
    players: [{...}, {...}]
  }]
};

const randomGame = generateGame(gameConfig);
```

When `generateGame` is called with its configuration, it returns an object like this:

```js
{
  history: [{...}, {...}], // what happened for each possession
  score: [100, 99],
  teamWithBall: 0,
  possessionsPlayed: 152,
  overtime: false,
  remainingPossessions: 0
}
```

The objects inside the `history` array look like this:

```js
{
  action: 'shootMissed', // or shootMade
  id: 'BS9111AY63OYH811550N', // player id
  result: 2 // type of shoot made by the player
}
```