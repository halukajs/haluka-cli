/**
 * Copyright (c) Robin Panta
 */

const chalk = require('chalk');

module.exports = ({ command, alias, description }, handler) => ({
  command: chalk.magenta(command),
  aias: alias,
  description: chalk.cyan(description),
  handler,
});
