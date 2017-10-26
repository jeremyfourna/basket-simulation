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

    const secForStyle = R.ifElse(
      R.equals('nba'),
      R.always(R.multiply(48, 60)),
      R.always(R.multiply(48, 60))
    );

    return secondsInAPossession(secForStyle(style));
  }

  return R.cond([
    [R.equals('nba'), style => {
      return { remainingPossessions: minutesInAGame(style) };
    }],
    [R.equals('fiba'), style => {
      return { remainingPossessions: minutesInAGame(style) };
    }],
    [R.T, temp => 'We only know nba or fiba as basket-ball style']
  ])(style);
}

console.log('generateGame()', generateGame('nba', ['normal', 'fast']));
