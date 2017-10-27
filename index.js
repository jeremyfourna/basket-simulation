const R = require('ramda');

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

function initGame(style, teamsSpeed) {

  const defaultConfig = R.assoc('remainingPossessions', R.__, {
    style,
    teamsSpeed,
    history: [],
    score: [0, 0],
    teamWithBall: 0,
    possessionsPlayed: 0
  });

  return R.cond([
    [R.equals('nba'), style => defaultConfig(minutesInAGame(style, teamsSpeed))],
    [R.equals('fiba'), style => defaultConfig(minutesInAGame(style, teamsSpeed))],
    [R.T, style => `We only know nba or fiba as basket-ball style, ${style} is unknown`]
  ])(style);
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
  const probaFT = R.divide(20, 110);
  const proba3pts = R.divide(30, 110);
  const proba2pts = R.divide(60, 110);
  return R.cond([
    [R.flip(R.gte)(proba2pts), R.always(2)],
    [R.flip(R.gte)(proba3pts), R.always(3)],
    [R.flip(R.lte)(probaFT), R.always(1)]
  ])(Math.random());
}

function generateGame(config) {
  //console.log(config);
  const shoot = typeOfShoot();
  const shootResult = willScore(shoot, 100);

  if (R.equals(R.prop('remainingPossessions', config), 0)) {
    if (R.equals(R.head(R.prop('score', config)), R.last(R.prop('score', config)))) {
      const newConfig = R.assoc('remainingPossessions', minutesInAGame('overtime', R.prop('teamsSpeed', config)), config);
      const newConfig1 = R.assoc('overtime', true, newConfig);
      return generateGame(newConfig1);
    } else {

      return config;
    }
  } else if (R.equals(shootResult, true)) {
    const transformations = {
      remainingPossessions: R.dec,
      score: R.adjust(R.add(shoot), R.prop('teamWithBall', config)),
      teamWithBall: change,
      possessionsPlayed: R.inc
    };
    const newConfig = R.evolve(transformations, config);

    return generateGame(newConfig);
  } else {
    const transformations = {
      remainingPossessions: R.dec,
      teamWithBall: change,
      possessionsPlayed: R.inc
    };
    const newConfig = R.evolve(transformations, config);

    return generateGame(newConfig);
  }
}

console.log('generateGame()', generateGame(initGame('nba', ['normal', 'normal'])));

exports.generateGame = generateGame;
exports.initGame = initGame;
