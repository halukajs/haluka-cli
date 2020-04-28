
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

/**
 * Copyright (c) Robin Panta
 * Inspire Command
 */
module.exports = command({
  command: 'run <command>',
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
  const halukaVersion = pkg.dependencies.haluka;
  console.log(`Application Haluka Version: ${halukaVersion}`);
  console.log(chalk.greenBright(`Haluka CLI running inside '${pkg.name}'`));
  console.log(yargv);
  // console.log('Called from Outside');
});
