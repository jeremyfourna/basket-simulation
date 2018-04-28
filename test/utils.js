const assert = require('chai').assert;
const { charactForShoot } = require('../src/utils');

describe('utils.js', () => {
  describe('Function charactForShoot()', () => {
    it('Must return ft for 1', () => {
      assert.isString(charactForShoot(1));
      assert.equal('ft', charactForShoot(1));
    });
    it('Must return twoPts for 2', () => {
      assert.isString(charactForShoot(2));
      assert.equal('twoPts', charactForShoot(2));
    });
    it('Must return threePts for 3', () => {
      assert.isString(charactForShoot(3));
      assert.equal('threePts', charactForShoot(3));
    });
    it('Must return twoPts for everything else', () => {
      assert.isString(charactForShoot(4));
      assert.equal('twoPts', charactForShoot(4));
      assert.equal('twoPts', charactForShoot(5));
      assert.equal('twoPts', charactForShoot('Jordan'));
    });
  });
});
