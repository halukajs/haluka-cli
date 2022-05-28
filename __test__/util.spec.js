/* eslint-disable no-undef */

const path = require('path');
const util = require('../lib/util');

describe('Util', () => {
  describe('#getCurrentPath', () => {
    test('should return current working directory', () => {
      expect(util.getCurrentPath()).toBe(path.resolve(`${__dirname}/../`));
      expect(util.getCurrentPath('sample_file', 'log.log')).toBe(path.resolve(`${__dirname}/../sample_file/log.log`));
    });
  });

  describe('#getPackageJSON', () => {
    test('should return package.json object from the specified directory', () => {
      expect(util.getPackageJSON('../')).toHaveProperty('name', 'haluka-cli');
    });
  });

});
