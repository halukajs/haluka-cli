/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const ACCEPTED_VERSION = '>=0.1.0';

const path = require('path');
const semver = require('semver');

module.exports.getCurrentPath = () => process.cwd();

module.exports.getPackageJSON = (directory) => {
  const pkgFile = path.join(directory, 'package.json');
  return require(pkgFile);
};

module.exports.checkHalukaDependency = (packageData) => !(!packageData || !packageData.dependencies || !('haluka' in packageData.dependencies));

module.exports.verifyHalukaVersion = (packageData) => {
  const halukaVersion = packageData.dependencies.haluka;
  return semver.satisfies(halukaVersion, ACCEPTED_VERSION);
};

module.exports.requiredHaluka = () => ACCEPTED_VERSION;
