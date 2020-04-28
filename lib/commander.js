/**
 * Copyright (c) Robin Panta
 */

const chalk = require('chalk');

module.exports = ({ command, alias, description }, handler) => ({
  command,
  aias: alias,
  description: chalk.magentaBright(description),
  handler,
});
