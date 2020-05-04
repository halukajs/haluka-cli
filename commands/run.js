/* eslint-disable import/no-dynamic-require */

const chalk = require('chalk');
const async = require('async');
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
  const rcFile = util.getCurrentPath('.halukacli.js');
  if (util.checkHalukaRC(rcFile)) {
    try {
      // eslint-disable-next-line global-require
      rc = require(rcFile);
    } catch (error) {
      console.error(chalk.redBright('You have error in your .halukacli.js file.'));
      console.error(chalk.yellowBright(error));
      process.exit(1);
    }
  } else {
    console.error(chalk.redBright('.halukacli.js file not found in the active directory.'));
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

  const startTime = Date.now();

  const rc = loadRC();
  const notFound = commands.filter((x) => !(x in rc));

  if (notFound.length > 0) {
    console.log(chalk.redBright(`No command registered for '${notFound.join(', ')}'. Check your '.halukacli.js' file and try again.`));
    process.exit(0);
  }

  const executables = (commands.map((x) => async () => {
    console.log(); console.log(chalk.yellowBright(`Running '${x}'...`)); console.log();
    await rc[x]();
    console.log(); console.log(chalk.greenBright(`Completed '${x}'...`));
  }));

  async.series(executables, (err) => {
    console.log();
    const endTime = Date.now();
    if (err) {
      const stackTrace = err.stack.split('\n').filter((x) => x.includes(process.cwd())).join('\n\t\t');
      console.log(chalk.redBright(`Error occurred during command execution: \n\n \t\t${err} \n\t\t${stackTrace}\n\n`));
      process.exit(1);
    }
    console.log(chalk.greenBright(`Command executed in ${(endTime - startTime) / 1000}s.`));
  });
});
