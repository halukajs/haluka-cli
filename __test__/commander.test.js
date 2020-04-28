/* eslint-disable no-undef */

const commander = require('../lib/commander');

test('Commander', () => {
  test('should return yargs command options', () => {
    const newCommand =commander({
      command: 'test_command',
      alias: ['tc'],
      description: 'A test command.',
    }, () => {
      // just some stuffs
    });

    expect(newCommand).toHaveProperty('command', 'test_command');
    expect(newCommand).toHaveProperty('alias', ['tc']);
    expect(newCommand).toHaveProperty('description', 'A test command.');
    expect(newCommand).toHaveProperty('handler');
  });
});
