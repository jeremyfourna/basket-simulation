/* jshint esversion: 6 */

const {
  always,
  assoc,
  curry,
  equals,
  evolve,
  findIndex,
  head,
  isEmpty,
  isNil,
  last,
  length,
  lensProp,
  map,
  memoizeWith,
  merge,
  over,
  prop,
  propEq,
  tail,
} = require('ramda');
const { charactForShoot } = require('./utils');

// preparePlayersForGame :: [object] -> [object]
function preparePlayersForGame(team) {
  const defaultStats = {
    stats: {
      ft: [0, 0],
      twoPts: [0, 0],
      threePts: [0, 0],
      pts: 0,
      eval: 0
    }
  };
  return over(
    lensProp('players'),
    map(el => merge(el, defaultStats)),
    team
  );
}

// boxscore :: (object, [object]) -> object
function boxscore(gameConfig, history) {
  // index :: [object, object] -> object -> [number]
  function index(teams) {
    const results = {};

    return function(action) {
      const playerId = prop('id', action);

      if (isNil(prop(playerId, results))) {
        const result = map(cur => {
          return findIndex(propEq('id', playerId), prop('players', cur))
        }, teams);
        if (equals(head(result), -1)) {
          results[playerId] = [1, last(result)];
          return prop(playerId, results);
        } else {
          results[playerId] = [0, head(result)];
          return prop(playerId, results);
        }
      } else {
        return prop(playerId, results);
      }
    }
  }

  // buildBoxscore :: (object, [object]) -> object
  function buildBoxscore(gameConfig, history) {
    function newTeam(action, team) {
      function getTransformations(action) {
        const prop = R.prop(R.__, action);

        return R.cond([
          [R.equals('shootMade'), () => ({
            [charactForShoot(prop('result'))]: R.map(R.inc),
            pts: R.add(prop('result')),
            eval: R.add(prop('result'))
          })],
          [R.equals('shootMissed'), () => ({
            [charactForShoot(prop('result'))]: R.adjust(R.inc, 1),
            eval: R.dec
          })]
        ])(prop('action'));
      }

      return R.adjust(
        player => R.over(lensProp('stats'), R.evolve(getTransformations(action)), player),
        index(action, team),
        team
      );
    }

    // We finished processing the game
    if (equals(length(history), 0)) {
      return gameConfig;
    } else {
      // We take the first in the history array
      const action = head(history);

      return buildBoxscore(gameConfig, tail(history));
    }
  }

  const indexPartial = index(prop('teams', gameConfig));

  return buildBoxscore(
    over(
      lensProp('teams'),
      map(preparePlayersForGame),
      gameConfig
    ),
    history
  );
}

exports.boxscore = curry(boxscore);
