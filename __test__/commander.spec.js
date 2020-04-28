/* eslint-disable no-undef */

const chalk = require('chalk');

const commander = require('../lib/commander');


describe('Commander', () => {
  test('should return yargs command options', () => {
    const newCommand = commander({
      command: 'test_command',
      alias: ['tc'],
      description: 'A test command.',
    }, () => {
      // just some stuffs
    });

    expect(newCommand).toHaveProperty('command', 'test_command');
    expect(newCommand).toHaveProperty('alias', ['tc']);
    expect(newCommand).toHaveProperty('description', chalk.magentaBright('A test command.'));
    expect(newCommand).toHaveProperty('handler');
    expect(newCommand.handler).toBeInstanceOf(Function);
  });
});
