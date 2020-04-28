const os = require('os');
const chalk = require('chalk');

module.exports = (error) => {
  if (error) {
    console.error(chalk.red('An unexpected error occurred! Please open an issue at:'));
    console.error(chalk.red('https://github.com/halukajs/haluka-cli/issues'));
    console.error('Error Text');
    console.error('------------------------------------------');
    console.error(`Node Version: ${process.version}`);
    console.error(`Platform: ${process.platform} ${os.release()}`);
    console.error(`Processor Architecture: ${process.arch}`);
    console.error(error);
    console.error('------------------------------------------');
    process.exit(1);
  }
};
