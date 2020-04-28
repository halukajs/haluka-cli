/* eslint-disable no-undef */

const inspireCommand = require('../commands/inspire');

test('Inspire Command', () => {
  expect(() => inspireCommand.inspire.handler()).not.toThrow();
});
