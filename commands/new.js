const chalk = require('chalk')
const fs = require('fs')
const { command, getCurrentPath, checkHalukaRC } = require('../lib/util')


const path = require('path');
const semver = require('semver');
const slugify = require('slugify');
const { spawnSync } = require('child_process');
const async = require('async');


const prettyPrintError = (error) => {
  console.error(`\n  ${this.chalk.bgRed.white(' Error ')} ${this.chalk.red(error.message)}\n`)
}

const SEED_PATH = 'https://github.com/halukadev/seed.git'

module.exports = command({
  command: 'new <name>',
  description: 'Setups a new Haluka project.',
}, (yargv) => {
  const projectName = yargv.name;
  if (fs.existsSync(getCurrentPath(projectName))) {
    console.error(chalk.red(`Error: Cannot create project. \nA file or folder with name '${projectName}' already exists in the active directory.`))
    process.exit(1);
  }

  try {
    createApp(projectName, false)
  } catch (error) {
    prettyPrintError(error)
    process.exit(1)
  }
})

function createApp (projectName, yarn) {
  const rootPath = getCurrentPath(projectName)

  console.log(`Creating a new Haluka app in ${chalk.green(rootPath)}.`)
  console.log()

  async.series([

    async () => {
      console.log(chalk.yellow('Creating your app...'))

      // cloning from git and removing .git as a way of creating new project
      spawnSync('git', ['clone', '--depth=1', SEED_PATH, projectName])
      fs.rmSync(path.resolve(process.cwd(), projectName, '.git'), { recursive: true, force: true })

      // set package name
      const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), projectName, 'package.json'), 'utf8'))
      pkg.name = slugify(projectName)
      pkg.version = '1.0.0'
      pkg.description = 'An awesome project built on Haluka Framework'
      fs.writeFileSync(path.resolve(process.cwd(), projectName, 'package.json'), JSON.stringify(pkg, null, 2))
      console.log(chalk.green('Done!'))
    },

    async () => {
      console.log(chalk.yellow('Installing app dependencies...'))
      spawnSync(yarn ? 'yarn' : 'npm', ['install'], { cwd: path.resolve(process.cwd(), projectName), stdio: 'inherit' })
      console.log(chalk.green('Done!'))
    },

    async () => {
      console.log(chalk.yellow('Making things ready...'))
      if (checkHalukaRC(getCurrentPath('.halukacli.js'))) {
        spawnSync('haluka', ['run', 'setup'], { cwd: path.resolve(process.cwd(), projectName), stdio: 'inherit' })
        console.log(chalk.green('Done!'))
      }
    },

    // Creating .env files

    () => {
      console.log();
      console.log(chalk.greenBright('App successfully crafted. Enjoy building with Haluka!'));
      console.log();
    },

  ])

}