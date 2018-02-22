"use strict";

let config    = require("../config");
let logger    = require("../core/logger");
let chalk 	  = require("chalk");
let moment    = require("moment");
var {bot}   = require('../core/bot');

let gracefulExit = function() {
  bot.on('disconnect', (errMsg, code) => {
    logger.info();
    logger.info(chalk.bold("---------------------[ Bot Disconnected at %s Uptime: %s ]---------------------------"),
      moment().format("YYYY-MM-DD HH:mm:ss.SSS"), moment.duration(process.uptime() * 1000).humanize());
    logger.info(chalk.bold("Error Message: ") + errMsg);
    logger.info(chalk.bold("Error code: ") + code);

    return process.exit(0);
  });

  if(bot.connected){
    bot.disconnect();
    logger.info();
    logger.info(chalk.bold("---------------------[ Bot Disconnected at %s Uptime: %s ]---------------------------"),
      moment().format("YYYY-MM-DD HH:mm:ss.SSS"), moment.duration(process.uptime() * 1000).humanize());
  }
  return process.exit(0);
};

process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);
