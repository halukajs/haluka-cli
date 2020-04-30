/* eslint-disable import/no-dynamic-require */

const chalk = require('chalk');
const command = require('../lib/commander');
const util = require('../lib/util');

function loadPackage() {
  let pkg;
  try {
    pkg = util.getPackageJSON(util.getCurrentPath());
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error(chalk.redBright('Error: "package.json" file not found in active directory.'));
    } else {
      console.error(chalk.redBright('You have error in your package.json file.'));
      console.error(chalk.yellowBright(error));
    }
    process.exit(1);
  }
  return pkg;
}

function loadRC() {
  let rc;
  try {
    // eslint-disable-next-line global-require
    rc = require(util.getCurrentPath('.halukacli'));
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error(chalk.redBright('Error: ".halukacli.js" file not found in the project.'));
    } else {
      console.error(chalk.redBright('You have error in your .halukacli.js file.'));
      console.error(chalk.yellowBright(error));
    }
    process.exit(1);
  }
  return rc;
}


/**
 * Copyright (c) Robin Panta
 * Inspire Command
 */
module.exports = command({
  command: 'run [commands...]',
  description: 'Runs commands from active Haluka application.',
}, (yargv) => {
  const pkg = loadPackage();
  if (!util.checkHalukaDependency(pkg)) {
    console.error(chalk.redBright('Dependency \'haluka\' is not installed locally on this project.'));
    console.info(chalk.yellowBright('Please install \'haluka\' first.'));
    process.exit(1);
  }

  if (!util.verifyHalukaVersion(pkg)) {
    console.error(chalk.redBright(`Your project '${pkg.name}' uses the version of haluka which is not supported by CLI tool.`));
    console.info(chalk.yellowBright(`Please use haluka of version ${util.requiredHaluka()}.`));
    process.exit(1);
  }

  // In the application
  console.log(chalk.greenBright(`CLI running inside '${pkg.name}'`));
  let commands = yargv.commands || ['default'];
  commands = commands.length === 0 ? ['default'] : commands;

  console.log(`Attempting to run ${chalk.yellowBright(commands.join(', '))} from '${pkg.name}'.`);

  const startTime = Date.now();

  const rc = loadRC();
  const notFound = commands.filter((x) => !(x in rc));

  if (notFound.length > 0) {
    console.log(chalk.redBright(`No command registered for '${notFound.join(', ')}'. Check your '.halukacli.js' file and try again.`));
    process.exit(0);
  }

  const executables = (commands.map((x) => rc[x])).reverse();

  console.log();
  // task();
  console.log();

  const endTime = Date.now();
  console.log(chalk.greenBright(`Command executed in ${(endTime - startTime) / 1000}s.`));
});
