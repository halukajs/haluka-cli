/* eslint-disable import/no-dynamic-require */

const chalk = require('chalk');
const async = require('async');
const { command } = require('../lib/util')
const util = require('../lib/util');
const inquirer = require('inquirer')

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

module.exports = command({
  command: 'run [commands...]',
  description: 'Runs commands from active Haluka App.',
}, (yargv) => {
  const pkg = loadPackage();

  // In the application
  console.log(chalk.greenBright(`CLI running inside '${pkg.name}'`));
  let commands = yargv.commands || ['default'];
  commands = commands.length === 0 ? ['default'] : commands;

  const startTime = Date.now();

  const rc = loadRC();

  const cmd = commands[0].split(':');

  const notFound = !(cmd[0] in rc);

  if (notFound) {
    console.log(chalk.redBright(`No command registered for '${cmd}'. Check your '.halukacli.js' file and try again.`));
    process.exit(0);
  }

  let opt = {
    method: cmd[1] || 'index',
    params: commands.splice(-1),
    prompt: inquirer.createPromptModule()
  }

  const executables = [
  async () => {
    if (typeof rc['preHooks'] == 'function') {
      await rc['preHooks'](opt);
    }
  },
  async () => {
      console.log(chalk.yellowBright(`Running '${cmd[0]}'...`));

      await rc[cmd[0]](opt);
      
      console.log(); console.log(chalk.greenBright(`Completed '${cmd[0]}'...`));
  },
  async () => {
    if (typeof rc['postHooks'] == 'function') {
      await rc['postHooks'](opt);
    }
  },
];

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
