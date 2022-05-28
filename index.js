/**
 * Copyright (c) Robin Panta
 * Haluka CLI
 */

 const https = require('https')
 const chalk = require('chalk')
 const semver = require('semver')
 const yargs = require('yargs')
 const packageJson = require('./package.json')
 const errorHandlr = require('./lib/error')
 const Table = require('cli-table3');

 const nodeVersion = process.versions.node
 const majorV = nodeVersion.split('.')[0]
 
 if (majorV < 14) {
	 console.error(
		 'You are running Node ' +
		 nodeVersion + '.\n' +
			'Haluka CLI requires Node 14 or higher. \n' +
			'Please update your version of Node.'
	 )
	 process.exit(1)
 }

function isYarn() {
	return (process.env.npm_config_user_agent || '').indexOf('yarn') === 0;
}

checkUpdates()
	.catch(() => {
		try {
			return execSync('npm view haluka-cli version').toString().trim();
		} catch (e) {
			return null
		}
	})
	.then(latest => {
		const yarn = isYarn()
		if (latest && semver.lt(packageJson.version, latest)) {
			console.log()
			let newVerTable = new Table()
			newVerTable.push(
				[chalk.yellow(
				`You are running 'haluka-cli' v${packageJson.version}, which is behind the latest release (${latest}).\n\n` +
				'Use following command to install the new version of Haluka CLI,'
			)],
			[`   ${chalk.redBright((yarn ? 'yarn global add haluka-cli@' : 'npm install -g haluka-cli@') + latest)}`]);
			console.log(newVerTable.toString())
			console.log()
		} else {
			try {
				
				yargs
					.scriptName('haluka')
					.version('version', chalk.yellowBright('Show version.'), packageJson.version)
					.usage(`${chalk.bold.underline('Usage:')} ${chalk.green('$0')} ${chalk.yellow('<command>')} ${chalk.blue('[args...] [options...]')}`)
					.help('help', chalk.yellowBright('Show help for the command'))
					.demandCommand()
					.recommendCommands()
					.commandDir('commands')
					.strict()
					.wrap(yargs.terminalWidth())
					.parse()

			} catch (error) {
				errorHandlr(error)
			}
		}
	})

function checkUpdates() {
	return new Promise((resolve, reject) => {
		const req = https.get('https://registry.npmjs.org/-/package/haluka-cli/dist-tags', res => {
			if (res.statusCode === 200) {
				let body = '';
					res.on('data', data => (body += data));
					res.on('end', () => {
						resolve(JSON.parse(body).latest);
					});
			} else {
				reject()
			}
		})
	})
}