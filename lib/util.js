'use strict'

const chalk = require('chalk')
const path = require('path')
const fs = require('fs')

module.exports = {

    command : function ({ command, alias, description }, handler) {
        return ({
            command,
            alias,
            description: chalk.magentaBright(description),
            handler,
        })
    },

    getCurrentPath : (...args) => path.join(process.cwd(), ...args),

    getPackageJSON : (directory) => {
        const pkgFile = path.join(directory, 'package.json');
        return require(pkgFile);
    },

    checkHalukaRC : (rcFilePath) => fs.existsSync(rcFilePath)
        && fs.lstatSync(rcFilePath).isFile(),


}