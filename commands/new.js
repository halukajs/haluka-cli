const chalk = require('chalk');
const fs = require('fs');
const util = require('../lib/util');
const command = require('../lib/commander');

const prettyPrintError = (error) => {
  console.error(`\n  ${this.chalk.bgRed.white(' Error ')} ${this.chalk.red(error.message)}\n`);
};

const SEED_PATH = 'https://github.com/halukadev/seed.git';

/**
 * Copyright (c) Robin Panta
 * New Command
 */
module.exports = command({
  command: 'new <name>',
  description: 'Setups a new Haluka project.',
}, (yargv) => {
  const projectName = yargv.name;
  if (fs.existsSync(util.getCurrentPath(projectName))) {
    console.error(chalk.red(`Error: Cannot create project. \nA file or folder with name '${projectName}' already exists in the active directory.`));
    process.exit(1);
  }

  try {
    util.createApp(SEED_PATH, projectName);
  } catch (error) {
    prettyPrintError(error);
    process.exit(1);
  }
  // safe to create project. Pull project seed from git.
});
