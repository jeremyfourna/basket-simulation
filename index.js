const R = require('ramda');
const {generateGame, initGame, initPlayers} = require('./src/game-generation');

const gameConfig = ['fiba', ['normal', 'normal']];

const game = generateGame(initGame(...gameConfig, initPlayers()));

function boxscore(game) {
  function buildBoxscore(history, team1, team2) {
    function index(shoot, team) {
      return R.findIndex(R.propEq('id', R.head(shoot)), team);
    }

    function newTeam(shoot, team) {
      return R.adjust(player => R.assoc('pts', R.add(R.last(shoot), R.prop('pts', player) || 0), player), index(shoot, team), team);
    }

    if (R.equals(R.length(history), 0)) {
      return [team1, team2];
    } else {
      const shoot = R.head(history);
      const shootIsInTeam1 = R.contains(R.head(shoot), R.map(cur => R.prop('id', cur), team1));

      if (R.equals(shootIsInTeam1, true)) {

        return buildBoxscore(R.tail(history), newTeam(shoot, team1), team2);
      } else {

        return buildBoxscore(R.tail(history), team1, newTeam(shoot, team2));
      }
    }
  }

  const playersWhoScored = R.prop('history', game);
  const teams = R.prop('players', game);

  return buildBoxscore(playersWhoScored, ...teams);
}

console.log(R.prop('score', game));
console.log(boxscore(game));
