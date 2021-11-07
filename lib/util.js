/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const ACCEPTED_VERSION = '>=0.1.0';

const path = require('path');
const semver = require('semver');
const fs = require('fs');
const slugify = require('slugify');
const { spawn } = require('child_process');
const async = require('async');
const chalk = require('chalk');

module.exports.getCurrentPath = (...args) => path.join(process.cwd(), ...args);

module.exports.getPackageJSON = (directory) => {
  const pkgFile = path.join(directory, 'package.json');
  return require(pkgFile);
};

module.exports.checkHalukaDependency = (packageData) => !(!packageData || !packageData.dependencies || !('haluka' in packageData.dependencies));

module.exports.verifyHalukaVersion = (packageData) => {
  const halukaVersion = packageData.dependencies.haluka;
  return semver.gte(semver.minVersion(halukaVersion), semver.minVersion(ACCEPTED_VERSION));
};

module.exports.requiredHaluka = () => ACCEPTED_VERSION;

module.exports.checkHalukaRC = (rcFilePath) => fs.existsSync(rcFilePath)
  && fs.lstatSync(rcFilePath).isFile();

module.exports.createApp = (SEED_PATH, projectName) => {
  async.series([
    async () => {
      console.log(chalk.yellow('Creating your app...'));
      await spawn('git', ['clone', '--depth=1', SEED_PATH, projectName]);
      await fs.rm(path.resolve(process.cwd(), projectName, '.git'), { recursive: true, force: true });

      // set package name
      const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), projectName, 'package.json'), 'utf8'));
      pkg.name = slugify(projectName);
      pkg.version = '0.0.0';
      pkg.description = '';
      await fs.writeFile(path.resolve(process.cwd(), projectName, 'package.json'), JSON.stringify(pkg, null, 2));
      console.log(chalk.green('Done!'));
    },

    async () => {
      console.log(chalk.yellow('Installing app dependencies...'));
      await spawn('npm', ['install'], { cwd: path.resolve(process.cwd(), projectName) });
      console.log(chalk.green('Done!'));
    },

    async () => {
      console.log(chalk.yellow('Making things ready...'));
      await spawn('haluka', ['run', 'setup'], { cwd: path.resolve(process.cwd(), projectName), stdio: 'inherit' });
      console.log(chalk.green('Done!'));
    },

    () => {
      console.log();
      console.log(chalk.greenBright('App successfully crafted. Enjoy building with Haluka!'));
      console.log();
    },
  ]);
};
