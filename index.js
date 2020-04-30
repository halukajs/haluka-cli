/**
 * Copyright (c) Robin Panta
 * Haluka CLI
 */

const yargs = require('yargs');
const chalk = require('chalk');

const errorHandlr = require('./lib/error');
const VERSION = require('./package.json').version;

// Setup Debugger
const cl = console.log;
console.log = (...args) => { cl(`[${chalk.blueBright((new Date()).toLocaleTimeString())}]`, ...args); };

try {
  yargs
    .commandDir('commands')
    .usage(`${chalk.bold.underline('Usage:')} ${chalk.green('$0')} ${chalk.yellow('<command>')} ${chalk.blue('[args...] [options...]')}`)
    // .completion('completion', chalk.yellowBright('Command completed.'))
    .demandCommand()
    .help('help', chalk.yellowBright('Show help for the command'))
    .recommendCommands()
    .scriptName('haluka')
    .strict()
    .version('version', chalk.yellowBright('Show version.'), VERSION)
    .wrap(yargs.terminalWidth())
    .parse();
} catch (error) {
  errorHandlr(error);
}
