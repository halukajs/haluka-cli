/* eslint-disable no-undef */

const inspireCommand = require('../commands/inspire');

describe('Inspire Command', () => {
  test('should not throw', () => {
    expect(() => inspireCommand.handler()).not.toThrow();
  });
});
