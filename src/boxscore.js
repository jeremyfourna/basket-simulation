/* jshint esversion: 6 */

const {
  __,
  add,
  adjust,
  always,
  assoc,
  cond,
  curry,
  equals,
  evolve,
  dec,
  findIndex,
  head,
  inc,
  isEmpty,
  isNil,
  last,
  length,
  lensPath,
  lensProp,
  map,
  memoizeWith,
  merge,
  over,
  prop,
  propEq,
  tail,
  view
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

// findIndexForAction :: [object, object] -> object -> [string, number, string, number]
function findIndexForAction(teams) {
  const results = {};

  return function(action) {
    const playerId = prop('id', action);

    if (isNil(prop(playerId, results))) {
      const result = map(cur => {
        return findIndex(propEq('id', playerId), prop('players', cur))
      }, teams);
      if (equals(head(result), -1)) {
        results[playerId] = [1, 'players', last(result)];

        return prop(playerId, results);

      } else {
        results[playerId] = [0, 'players', head(result)];

        return prop(playerId, results);
      }
    } else {
      return prop(playerId, results);
    }
  }
}

// boxscore :: (object, [object]) -> object
function boxscore(gameConfig, history) {
  // evolveTeamWithAction :: ([object, object], object) -> [object, object]
  function evolveTeamWithAction(teams, action) {
    function getTransformations(action) {
      const p = prop(__, action);

      return cond([
        [equals('shootMade'), () => ({
          stats: {
            [charactForShoot(p('result'))]: map(inc),
            pts: add(p('result')),
            eval: add(p('result'))
          }
        })],
        [equals('shootMissed'), () => ({
          stats: {
            [charactForShoot(p('result'))]: adjust(inc, 1),
            eval: dec
          }
        })]
      ])(p('action'));
    }

    const playerPathLens = lensPath(findIndexForActionPartial(action));

    return over(playerPathLens, evolve(getTransformations(action)), teams);
  }

  // buildBoxscore :: (object, [object]) -> object
  function buildBoxscore(gameConfig, history) {
    // We finished processing the game
    if (equals(length(history), 0)) {
      return gameConfig;
    } else {
      // We take the first in the history array
      const action = head(history);
      const newGameConfig = assoc(
        'teams',
        evolveTeamWithAction(prop('teams', gameConfig), action),
        gameConfig
      );

      return buildBoxscore(newGameConfig, tail(history));
    }
  }

  const findIndexForActionPartial = findIndexForAction(prop('teams', gameConfig));

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
