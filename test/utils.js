const assert = require('chai').assert;
const { charactForShoot } = require('../src/utils');

describe('utils.js', () => {
  describe('Function charactForShoot()', () => {
    it('Must return ft for 1', () => {
      assert.equal('ft', charactForShoot(1));
    });
    it('Must return twoPts for 2', () => {
      assert.equal('twoPts', charactForShoot(2));
    });
    it('Must return threePts for 3', () => {
      assert.equal('threePts', charactForShoot(3));
    });
  });
});
