const R = require('ramda');
const { charactForShoot } = require('./utils');

function boxscore(team1, team2, history) {
  function preparePlayersForGame(team) {
    return R.map(el => R.merge(el, {
      stats: {
        ft: [0, 0],
        twoPts: [0, 0],
        threePts: [0, 0],
        pts: 0,
        eval: 0
      }
    }), team);
  }

  function buildBoxscore(team1, team2, history) {

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
    // We finished processing the game
    if (R.equals(R.length(history), 0)) {

      return [team1, team2];
      // We still have some event to process
    } else {
      // We take the first in the history array
      const event = R.head(history);
      const eventIsInTeam1 = R.contains(R.prop('id', event), R.map(cur => R.prop('id', cur), team1));

      if (R.equals(eventIsInTeam1, true)) {

        return buildBoxscore(newTeam(event, team1), team2, R.tail(history));
      } else {

        return buildBoxscore(team1, newTeam(event, team2), R.tail(history));
      }
    }
  }

  return buildBoxscore(preparePlayersForGame(team1), preparePlayersForGame(team2), R.prop('history', history));
}

exports.boxscore = boxscore;
