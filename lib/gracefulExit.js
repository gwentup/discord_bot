"use strict";

let config    = require("../config");
let logger    = require("../core/logger");
let chalk 	  = require("chalk");
let moment    = require("moment");
let { client }   = require('../core/bot');

let gracefulExit = function() {
  client.on('disconnect', (errMsg, code) => {
    logger.info();
    logger.info(chalk.bold("---------------------[ Bot Disconnected at %s Uptime: %s ]---------------------------"),
      moment().format("YYYY-MM-DD HH:mm:ss.SSS"), moment.duration(process.uptime() * 1000).humanize());
    logger.info(chalk.bold("Error Message: ") + errMsg);
    logger.info(chalk.bold("Error code: ") + code);

    return process.exit(0);
  });

  if(client){

    client.destroy()
      .then( result => {
        logger.info();
        logger.info(chalk.bold("---------------------[ Bot Disconnected at %s Uptime: %s ]---------------------------"),
          moment().format("YYYY-MM-DD HH:mm:ss.SSS"), moment.duration(process.uptime() * 1000).humanize());

        return process.exit(0);
      });
  }
};

process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);
