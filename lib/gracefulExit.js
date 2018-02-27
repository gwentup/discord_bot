"use strict";

let config    = require("../config");
let logger    = require("../core/logger");
let chalk 	  = require("chalk");
let moment    = require("moment");
let { client }   = require('../core/bot');

client.on('error', (error) => {
  console.log('error', error)
  logger.info();
  logger.info(chalk.bold("---------------------[ Bot Error at %s Uptime: %s ]---------------------------"),
    moment().format("YYYY-MM-DD HH:mm:ss.SSS"), moment.duration(process.uptime() * 1000).humanize());
  logger.info(chalk.bold("Error Message: ") +  error.message);

  return process.exit(0);
});

client.on('disconnect', (errMsg, code) => {
  console.log('disconnect', errMsg)

  logger.info();
  logger.info(chalk.bold("---------------------[ Bot Disconnected at %s Uptime: %s ]---------------------------"),
    moment().format("YYYY-MM-DD HH:mm:ss.SSS"), moment.duration(process.uptime() * 1000).humanize());
  logger.info(chalk.bold("Error Message: ") + errMsg);
  logger.info(chalk.bold("Error code: ") + code);

  return process.exit(0);
});
let gracefulExit = function() {

  if(client){
    client.destroy()
      .then( result => {
        logger.info();
        logger.info(chalk.bold("---------------------[ Bot Disconnected (destroyed) at %s Uptime: %s ]---------------------------"),
          moment().format("YYYY-MM-DD HH:mm:ss.SSS"), moment.duration(process.uptime() * 1000).humanize());

        return process.exit(0);
      });
  }
};

process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);
