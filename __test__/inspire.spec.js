/* eslint-disable no-undef */

const inspireCommand = require('../commands/inspire');

describe('Inspire Command', () => {
  test('should not throw', () => {
    const cl = console.log;
    console.log = () => {};
    expect(() => inspireCommand.handler()).not.toThrow();
    console.log = cl;
  });
});
