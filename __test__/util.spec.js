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

  describe('#checkHalukaDependency', () => {
    test('should check if active project has haluka dependency', () => {
      expect(util.checkHalukaDependency()).toBe(false);
      expect(util.checkHalukaDependency({})).toBe(false);
      expect(util.checkHalukaDependency({ dependencies: { rndmpkg: '0.0.0' } })).toBe(false);
      expect(util.checkHalukaDependency({ dependencies: { haluka: '0.0.0' } })).toBe(true);
    });
  });

  describe('#verifyHalukaVersion', () => {
    test('should verify if the haluka version installed in active project satisfies required version', () => {
      expect(util.verifyHalukaVersion({ dependencies: { haluka: '0.0.0' } })).toBe(false);
      expect(util.verifyHalukaVersion({ dependencies: { haluka: '^0.1.1-5' } })).toBe(true);
    });
  });

  describe('#requiredHaluka', () => {
    test('should return the required version range of haluka', () => {
      expect(util.requiredHaluka()).toBe('>=0.1.0');
    });
  });
});
