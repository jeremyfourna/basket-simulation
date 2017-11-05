const R = require('ramda');
const { charactForShoot } = require('./utils');

function change(zeroOrOne) {
  return R.ifElse(
    R.equals(0),
    R.always(1),
    R.always(0)
  )(zeroOrOne);
}

function minutesInAGame(style, teamsSpeed) {
  function secondsInAPossession(remainingSec, nbPlays = 0, whoIsPlaying = 0) {
    const secToRemove = R.cond([
      [R.equals('fast'), R.always(12)],
      [R.equals('slow'), R.always(20)],
      [R.equals('normal'), R.always(15)],
      [R.T, R.always(24)]
    ]);

    if (R.lte(remainingSec, 0)) {
      return nbPlays;
    } else {
      return secondsInAPossession(
        R.subtract(remainingSec, secToRemove(R.nth(whoIsPlaying, teamsSpeed))),
        R.inc(nbPlays),
        change(whoIsPlaying)
      );
    }
  }

  const secForStyle = R.cond([
    [R.equals('nba'), R.always(R.multiply(48, 60))],
    [R.equals('fiba'), R.always(R.multiply(40, 60))],
    [R.equals('overtime'), R.always(R.multiply(5, 60))]
  ]);

  return secondsInAPossession(secForStyle(style));
}

function willScore(shoot, playerCharact) {
  function probabilityToScore(percentage) {
    return (R.gte(Math.random(), R.add(percentage, scaleForScoreChance(playerCharact)))) ? true : false;
  }

  function scaleForScoreChance(playerCharact) {
    return R.cond([
      [R.flip(R.gte)(90), R.always(-0.15)],
      [R.flip(R.gte)(80), R.always(-0.10)],
      [R.flip(R.gte)(70), R.always(-0.05)],
      [R.flip(R.gte)(60), R.always(0)],
      [R.flip(R.gte)(50), R.always(0.1)],
      [R.flip(R.gte)(40), R.always(0.2)],
      [R.flip(R.gte)(30), R.always(0.3)],
      [R.flip(R.gte)(20), R.always(0.4)],
      [R.flip(R.gte)(10), R.always(0.5)],
      [R.T, R.always(0.7)]
    ])(playerCharact);
  }
  // On average players will have an accuracy between 80%
  // and 90% at the Free Thrown exercice
  // so 1 - 0.8 = 0.2
  // On average players will have an accuracy between 40%
  // and 50% at the 2pts exercice
  // so 1 - 0.4 = 0.6
  // On average players will have an accuracy between 30%
  // and 40% at the 3pts exercice
  // so 1 - 0.3 = 0.7
  return R.cond([
    [R.equals(1), () => probabilityToScore(0.2)],
    [R.equals(2), () => probabilityToScore(0.6)],
    [R.equals(3), () => probabilityToScore(0.7)]
  ])(shoot);
}

function typeOfShoot() {
  // On average their are 110 shoots per game
  // 20 are FT -> 20 / 110 = 18,18%
  // 30 are 3pts -> 30 / 110 = 27,27%
  // 60 are 2pts -> 60 / 110 = 54,54%
  //const probaFT = R.divide(20, 110);
  const proba3pts = R.divide(30, 110);
  const proba2pts = R.divide(60, 110);
  return R.cond([
    [R.flip(R.lte)(proba2pts), R.always(2)],
    [R.flip(R.lte)(R.add(proba2pts, proba3pts)), R.always(3)],
    [R.flip(R.gt)(R.add(proba2pts, proba3pts)), R.always(1)]
  ])(Math.random());
}

function whoWillShoot(team) {
  const player = Math.floor(Math.random() * 10);
  return R.nth(player, team);
}

function generateGame(style, team1, team2) {
  function needOvertime(history) {
    return R.equals(
      R.head(R.prop('score', history)),
      R.last(R.prop('score', history))
    );
  }

  function configForOvertime(history) {
    const transformations = {
      remainingPossessions: R.add(minutesInAGame('overtime', teamsSpeed)),
      overtime: R.T
    };

    return R.evolve(transformations, history);
  }

  const teamsSpeed = [R.prop('speed', team1), R.prop('speed', team2)];
  const history = {
    history: [],
    score: [0, 0],
    teamWithBall: 0,
    possessionsPlayed: 0,
    overtime: false,
    remainingPossessions: minutesInAGame(style, teamsSpeed)
  };

  const shoot = typeOfShoot();
  const player = whoWillShoot(R.nth(R.prop('teamWithBall', config), R.prop('players', config)));
  const shootMade = willScore(shoot, R.path(['charact', charactForShoot(shoot)], player));

  if (R.equals(R.prop('remainingPossessions', config), 0)) {

    return (needOvertime(config)) ? generateGame(configForOvertime(config)) : config;
  } else if (R.equals(shootMade, true)) {
    const transformations = {
      remainingPossessions: R.dec,
      score: R.adjust(R.add(shoot), R.prop('teamWithBall', config)),
      teamWithBall: change,
      possessionsPlayed: R.inc,
      history: R.append({
        action: 'shootMade',
        id: R.prop('id', player),
        result: shoot
      })
    };

    return generateGame(R.evolve(transformations, config));
  } else {
    const transformations = {
      remainingPossessions: R.dec,
      teamWithBall: change,
      possessionsPlayed: R.inc,
      history: R.append({
        action: 'shootMissed',
        id: R.prop('id', player),
        result: shoot
      })
    };

    return generateGame(R.evolve(transformations, config));
  }
}

function preparePlayersForGame(teams) {
  return R.map(cur => {
    return R.map(el => {
      return R.merge(el, {
        stats: {
          ft: [0, 0],
          twoPts: [0, 0],
          threePts: [0, 0],
          pts: 0,
          eval: 0
        }
      });
    });
  });
}


exports.generateGame = generateGame;
exports.initGame = initGame;
exports.initPlayers = initPlayers;
