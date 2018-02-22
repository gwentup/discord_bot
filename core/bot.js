
let config		= require("../config");
let logger 		= require("../core/logger");

var Discord = require('discord.io');

// Initialize Discord Bot
var bot = new Discord.Client({
  token: config.authKeys.discord.token,
  autorun: true
});

bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  console.log('meesage', user, userID, channelID, message);

  if (message.substring(0, 1) == '!') {
    var args = message.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);
    switch(cmd) {
      // !ping
      case 'ping':
        bot.sendMessage({
          to: channelID,
          message: 'Pong!'
        });
        break;
      // Just add any case commands if you want to..
    }
  }
});

bot.on('disconnect', (errMsg, code) => {
  logger.info();
  logger.info(chalk.bold("---------------------[ Bot Disconnected at %s Uptime: %s ]---------------------------"),
    moment().format("YYYY-MM-DD HH:mm:ss.SSS"), moment.duration(process.uptime() * 1000).humanize());
  return process.exit(0);
});

module.exports = {
  bot
};

