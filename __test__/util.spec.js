/* eslint-disable no-undef */

const path = require('path');
const util = require('../lib/util');

describe('Util', () => {
  describe('#getCurrentPath', () => {
    test('should return current working directory', () => {
      expect(util.getCurrentPath()).toBe(path.resolve(`${__dirname}/../`));
    });
  });

  describe('#getPackageJSON', () => {
    test('should return package.json object from the specified directory', () => {
      expect(util.getPackageJSON('../')).toHaveProperty('name', 'haluka-cli');
    });
  });
});
