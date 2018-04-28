/* jshint esversion: 6 */

const {
  __,
  add,
  adjust,
  always,
  and,
  append,
  compose,
  cond,
  curry,
  dec,
  divide,
  equals,
  evolve,
  flip,
  gt,
  gte,
  head,
  ifElse,
  inc,
  last,
  length,
  lte,
  map,
  multiply,
  path,
  prop,
  nth,
  subtract,
  T
} = require('ramda');
const {
  charactForShoot,
  btwIncExc
} = require('./utils');

// change :: number -> number
function change(zeroOrOne) {
  return ifElse(
    equals(0),
    always(1),
    always(0)
  )(zeroOrOne);
}

// typeOfShoot :: a -> number
function typeOfShoot(randomNumberBtw0And1 = Math.random()) {
  // On average their are 110 shoots per game
  // 20 are FT -> 20 / 110 = 18,18%
  // 30 are 3pts -> 30 / 110 = 27,27%
  // 60 are 2pts -> 60 / 110 = 54,54%
  //const probaFT = divide(20, 110);
  const proba3pts = divide(30, 110);
  const proba2pts = divide(60, 110);

  return cond([
    [gte(proba2pts), always(2)],
    [lte(add(proba2pts, proba3pts)), always(1)],
    [T, always(3)]
  ])(randomNumberBtw0And1);
}

// secInGameOrOvertime :: string -> number
function secInGameOrOvertime(style) {
  const secInMinute = 60;
  const minInNBA = 48;
  const minInFIBA = 40;
  const minInOvertime = 5;

  return cond([
    [equals('nba'), always(multiply(minInNBA, secInMinute))],
    [equals('fiba'), always(multiply(minInFIBA, secInMinute))],
    [equals('overtime'), always(multiply(minInOvertime, secInMinute))],
    [T, always(0)]
  ])(style);
}

// secInPossessionByStyle :: string -> number
function secInPossessionByStyle(speed) {
  return cond([
    [equals('fast'), always(12)],
    [equals('slow'), always(20)],
    [equals('normal'), always(15)],
    [T, always(24)]
  ])(speed);
}

// nbPlaysForGame :: (string, [string, string]) -> number
function nbPlaysForGame(style, teamsSpeed) {
  // possessionDuration :: (number, number, number) -> number
  function possessionDuration(nbPlays, whoIsPlaying, remainingSec) {
    if (lte(remainingSec, 0)) {
      return nbPlays;
    } else {
      return possessionDuration(
        inc(nbPlays),
        change(whoIsPlaying),
        subtract(remainingSec, secInPossessionByStyle(nth(whoIsPlaying, teamsSpeed)))
      );
    }
  }

  // 0, 0: because 0 plays have been made and first team start to play
  return possessionDuration(0, 0, secInGameOrOvertime(style));
}

// whoWillShoot :: [a] -> a
function whoWillShoot(team) {
  return compose(
    nth(__, team),
    Math.floor,
    multiply(Math.random()),
    length
  )(team);
}

// chanceToScore :: number -> number
function chanceToScore(playerCharact) {
  return cond([
    [btwIncExc(0, 10), always(-0.15)],
    [btwIncExc(10, 20), always(-0.10)],
    [btwIncExc(20, 30), always(-0.05)],
    [btwIncExc(30, 40), always(0)],
    [btwIncExc(40, 50), always(0.1)],
    [btwIncExc(50, 60), always(0.2)],
    [btwIncExc(60, 70), always(0.3)],
    [btwIncExc(70, 80), always(0.4)],
    [gte(90), always(0.5)],
    [T, always(-1)]
  ])(playerCharact);
}

// willScore :: (number, number) -> boolean
function willScore(shoot, playerCharact) {
  // probabilityToScore :: number -> boolean
  function probabilityToScore(percentage) {
    return gte(
      add(percentage, chanceToScore(playerCharact)),
      Math.random()
    );
  }

  // On average players will have an accuracy between 80%
  // and 90% at the Free Thrown exercice
  const FT_BASE_PROBABILITY = 0.45;
  // On average players will have an accuracy between 40%
  // and 50% at the 2pts exercice
  const TWO_PTS_BASE_PROBABILITY = 0.3;
  // On average players will have an accuracy between 30%
  // and 40% at the 3pts exercice
  const THREE_PTS_BASE_PROBABILITY = 0.15;

  return cond([
    [equals(1), () => probabilityToScore(FT_BASE_PROBABILITY)],
    [equals(2), () => probabilityToScore(TWO_PTS_BASE_PROBABILITY)],
    [equals(3), () => probabilityToScore(THREE_PTS_BASE_PROBABILITY)]
  ])(shoot);
}

// needOvertime :: [a, a] -> boolean
function needOvertime(gameScore) {
  return equals(head(gameScore), last(gameScore));
}

// generateGame :: object -> object
// config example
// {
//   style: 'nba',
//   teams: [{
//     name: 'New York Knicks',
//     speed: 'fast',
//     players: [{...}, {...}]
//   }, {
//     name: 'Boston Celtics',
//     speed: 'fast',
//     players: [{...}, {...}]
//   }]
// }
function generateGame(config) {
  // configForOvertime :: object -> object
  function configForOvertime(history) {
    const transformations = {
      remainingPossessions: add(secInGameOrOvertime('overtime', teamsSpeed)),
      overtime: T
    };

    return evolve(transformations, history);
  }

  // generatePossession :: ([object, object], object) -> object
  function generatePossession(teams, history) {
    const p = prop(__, history);
    const shoot = typeOfShoot();
    const player = whoWillShoot(prop('players', nth(p('teamWithBall'), teams)));
    const shootMade = willScore(shoot, path(['charact', charactForShoot(shoot)], player));

    if (equals(p('remainingPossessions'), 0)) {
      if (needOvertime(p('score'))) {
        return generatePossession(teams, configForOvertime(history));
      } else {
        return history;
      }
    } else if (shootMade) {
      const transformations = {
        remainingPossessions: dec,
        score: adjust(add(shoot), p('teamWithBall')),
        teamWithBall: change,
        possessionsPlayed: inc,
        history: append({
          action: 'shootMade',
          id: prop('id', player),
          result: shoot
        })
      };

      return generatePossession(teams, evolve(transformations, history));
    } else {
      const transformations = {
        remainingPossessions: dec,
        teamWithBall: change,
        possessionsPlayed: inc,
        history: append({
          action: 'shootMissed',
          id: prop('id', player),
          result: shoot
        })
      };

      return generatePossession(teams, evolve(transformations, history));
    }
  }

  const p = prop(__, config);
  const teamsSpeed = map(prop('speed'), p('teams'));

  const history = {
    history: [],
    score: [0, 0],
    teamWithBall: 0,
    possessionsPlayed: 0,
    overtime: false,
    remainingPossessions: nbPlaysForGame(p('style'), teamsSpeed)
  };

  return generatePossession(p('teams'), history);
}


// Exports for test
exports.change = change;
exports.chanceToScore = chanceToScore;
exports.nbPlaysForGame = curry(nbPlaysForGame);
exports.needOvertime = needOvertime;
exports.secInGameOrOvertime = secInGameOrOvertime;
exports.secInPossessionByStyle = secInPossessionByStyle;
exports.typeOfShoot = typeOfShoot;
exports.whoWillShoot = whoWillShoot;
exports.willScore = curry(willScore);
// Exports for index.js
exports.generateGame = curry(generateGame);
