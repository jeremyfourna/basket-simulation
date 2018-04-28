/* jshint esversion: 6 */

const {
  always,
  and,
  cond,
  curry,
  equals,
  gt,
  gte,
  lt,
  lte,
  T
} = require('ramda');

// charactForShoot :: number -> string
function charactForShoot(shoot) {
  return cond([
    [equals(1), always('ft')],
    [equals(2), always('twoPts')],
    [equals(3), always('threePts')],
    [T, always('twoPts')]
  ])(shoot);
}

// btwIncExc :: (number, number, number) -> boolean
function btwIncExc(min, max, value) {
  return and(gte(value, min), lt(value, max));
}


exports.charactForShoot = charactForShoot;
exports.btwIncExc = curry(btwIncExc);
