const R = require('ramda');

function generateGame(style, teamsSpeed) {
  function minutesInAGame(style) {
    function secondsInAPossession(remainingSec, nbPlays = 0, whoIsPlaying = 0) {
      console.log(style, teamsSpeed, remainingSec, nbPlays, whoIsPlaying);
      const secToRemove = R.cond([
        [R.equals('fast'), R.always(12)],
        [R.equals('slow'), R.always(20)],
        [R.equals('normal'), R.always(15)],
        [R.T, R.always(24)]
      ]);

      const change = R.ifElse(
        R.equals(0),
        R.always(1),
        R.always(0)
      );

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

    const minForStyle = R.ifElse(
      R.equals('nba'),
      R.always(48),
      R.always(40)
    );

    return secondsInAPossession(minForStyle(style));
  }

  return R.cond([
    [R.equals('nba'), R.always({ remainingPossessions: minutesInAGame(R.__) })],
    [R.equals('fiba'), R.always({ remainingPossessions: minutesInAGame(R.__) })],
    [R.T, temp => 'We only know nba or fiba as basket-ball style']
  ])(style);
}

console.log(generateGame('nba', ['normal', 'fast']));
