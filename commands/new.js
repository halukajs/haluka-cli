const chalk = require('chalk');
const fs = require('fs');
const command = require('../lib/commander');
const util = require('../lib/util');

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
  // safe to create project. Pull project seed from git.
});
