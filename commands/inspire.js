
const chalk = require('chalk');
const command = require('../lib/commander');

const inspirations = [
  'If Einstein were alive, he would use Haluka.',
  'Be yourself; everyone else is already taken.',
  'With Haluka you can achieve the impossible.',
  'Life is 10% what happens to us and 90% how we react to it.',
  'When life give you lemons, use Haluka to blend.',
];
/**
 * Copyright (c) Robin Panta
 * Inspire Command
 */
module.exports = command({
  command: 'inspire',
  // alias: ['i'],
  description: 'Inspires you to achieve more.',
}, () => {
  console.log();
  console.log(`     ${chalk.greenBright(inspirations[Math.floor(Math.random() * inspirations.length)])}`);
  console.log();
});
