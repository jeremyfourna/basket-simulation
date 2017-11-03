const R = require('ramda');
const { charactForShoot } = require('./utils');

function boxscore(game) {
  function buildBoxscore(history, team1, team2) {
    function index(action, team) {
      return R.findIndex(R.propEq('id', R.prop('id', action)), team);
    }

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
      const statsLens = R.lensProp('stats');
      return R.adjust(
        player => R.over(statsLens, R.evolve(getTransformations(action)), player),
        index(action, team),
        team
      );
    }

    if (R.equals(R.length(history), 0)) { // We finished processing the game

      return [team1, team2];
    } else { // We still have some event to process
      const event = R.head(history); // We take the first in the history array
      const eventIsInTeam1 = R.contains(R.prop('id', event), R.map(cur => R.prop('id', cur), team1));

      if (R.equals(eventIsInTeam1, true)) {

        return buildBoxscore(R.tail(history), newTeam(event, team1), team2);
      } else {

        return buildBoxscore(R.tail(history), team1, newTeam(event, team2));
      }
    }
  }

  const playersActions = R.prop('history', game);
  const teams = R.prop('players', game);

  return buildBoxscore(playersActions, ...teams);
}

exports.boxscore = boxscore;
