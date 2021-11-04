const chalk = require('chalk');
const https = require('https');
const semver = require('semver');
const Table = require('cli-table3');

const command = require('../lib/commander');
const VERSION = require('../package.json').version;

const newVerTable = new Table({
  // colWidths: [50],
});

/**
 * Copyright (c) Robin Panta
 * Update Command
 */

function getCurrentVersion() {
  console.log('Reading current application version...');
  return VERSION;
}

function checkForVersion() {
  console.log('Fetching lastest version...');
  return new Promise(((resolve, reject) => {
    const req = https.get('https://cdn.jsdelivr.net/npm/haluka-cli@latest/package.json', (res) => {
      let body = '';
      res.on('data', (data) => { body += data; });
      res.on('end', () => {
        if (res.statusCode === 200) return resolve(body);
        console.log(chalk.red(`Error - Bad Response ${res.statusCode}`));
        reject(res.statusCode);
        return null;
      });
      console.log(chalk.yellowBright('Sending request...'));
      req.on('error', reject);
      req.end();
    });
  }));
}

module.exports = command({
  command: 'update',
  description: 'Checks for the newer version of Haluka CLI.',
}, async () => {
  console.log(chalk.yellow('Checking for update...'));
  const installed = getCurrentVersion();
  console.log(chalk.greenBright('Success!'));
  try {
    const body = await checkForVersion();
    const remoteVersion = JSON.parse(body).version;
    console.log(chalk.greenBright('Success!'));
    if (semver.gt(remoteVersion, installed)) {
      console.log('');
      newVerTable.push([chalk.yellowBright(`A new version of Haluka CLI (${remoteVersion}) is available.`)], [`         Use following command to update. \n\n            ${chalk.redBright('npm install -g haluka-cli')}`]);
      console.log(newVerTable.toString());
      console.log('');
    } else {
      console.log('');
      console.log(chalk.greenBright('Haluka CLI is already the latest version.'));
    }
  } catch (error) {
    console.log(chalk.red('Error: Cannot fetch remote version.'));
  }
});
