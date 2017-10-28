const R = require('ramda');

function charactForShoot(shoot) {
  return R.cond([
    [R.equals(1), R.always('ft')],
    [R.equals(2), R.always('twoPts')],
    [R.equals(3), R.always('threePts')]
  ])(shoot);
}

exports.charactForShoot = charactForShoot;
