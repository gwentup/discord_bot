let config		= require("./config");
let logger 		= require("./core/logger");
let moment 		= require("moment");
let chalk 		= require("chalk");

logger.info();
logger.info(chalk.bold("---------------------[ Bot starting at %s ]---------------------------"), moment().format("YYYY-MM-DD HH:mm:ss.SSS"));
logger.info();

logger.info(chalk.bold("Application root path: ") + global.rootPath);

let init		= require("./core/init");
let bot		= require("./core/bot");

require("./lib/gracefulExit");
