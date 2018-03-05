
let config		= require("../config");
let logger 		= require("../core/logger");
let rp = require('request-promise');

let Discord = require('discord.js');
let chalk 	  = require("chalk");
let moment 	  = require("moment");

// Initialize Discord Bot
let client = new Discord.Client();

let icon = 'https://gwentup.com/logo-bot.png';

client.login(config.authKeys.discord.token);

client.on('ready', function (evt) {
  logger.info('Connected');
  logger.info(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  let message = msg.content.toLowerCase();
  if (message.substring(0, 1) !== '!') return;

  let args = message.substring(1).split(' ');
  let cmd = args[0];
  args = args.splice(1);
  let profile_name = args[0] ? args[0]: false;

  switch (cmd) {

    case 'profile':
      if(profile_name){
          let options = {
            uri: 'https://gwentup.com/api/bot/player/find',
            qs: {
               name: profile_name
            },
            headers: {
              'User-Agent': 'discord-bot'
            },
            json: true
          };
          let data = [];
          rp(options)
            .then((result) => {

              let resp = result[0];
              //could not find, or some other issue
              if (resp.type === 'BOT_FIND_PLAYER_ERROR') {
                msg.channel
                  .send(`There was a problem finding your profile. Please try again later`)
              }
              else if(resp.type === 'BOT_FIND_PLAYER_SUCCESS'){
                // msg.channel.send(`${msg.member}`);
                let d = resp.data;
                let res = d.results[0];
                let fields = d.results.map( ele => {
                  let nameField = 'ONLINE_MODE';
                  switch (ele.OnlineMode) {
                    case 0:
                      nameField = 'Casual';
                      break;
                    case 1:
                      nameField = 'Ranked';
                      break;
                    case 3:
                      nameField = 'Pro';
                      break;
                    case 4:
                      nameField = 'Arena';
                      break;
                    default:
                      nameField = 'Unknown';
                  }
                  let mmr = '';
                  if(ele.Mmr){
                     mmr = `MMR: ${ele.Mmr} #${ele.Position}\n`;
                  }
                  let val = `${mmr}W-L-D: ${ele.Win}-${ele.Lose}-${ele.Draw} (${ele.WinRate}%)`;
                  return {
                    name: nameField,
                    value: val,
                    inline: false
                  };
                });

                msg.channel.send(msg.member, {
                  embed: {
                  color: 0xdfda13,
                  // author: {
                  //   name: client.user.username,
                  //   icon_url: icon
                  // },
                  title: `${resp.data.name}. Go to profile →`,
                  url: resp.data.url + '?' + getUtmTags(msg),
                  // description: "This message will automatically delete itself in 60 seconds",
                  fields,
                  timestamp: new Date(),
                  footer: {
                    icon_url: icon,
                    text: "© Gwentup.com"
                  }
                }
                })
                .then(msgReply => {
                  msgReply.delete(300000);
                })
                .catch( err => {
                  logger.info();
                  logger.info(chalk.bold("---------------------[ Message Error at %s Uptime: %s ]---------------------------"),
                    moment().format("YYYY-MM-DD HH:mm:ss.SSS"), moment.duration(process.uptime() * 1000).humanize());
                  logger.info(chalk.bold("Error Message: ") + err.reason);
                  logger.info(chalk.bold("Error code: ") + err.code);                  });
              }
            })
            .catch( err  => {
              console.log('err', err.error);
              if(err.error && err.error[0] && err.error[0].type === 'BOT_FIND_PLAYER_ERROR'){
                msg.channel.send(`${msg.member} ${profile_name} was not found`)
                .then(msgReply => {
                  msgReply.delete(60000);
                });
              }
              else{
                msg.channel.send(`${msg.member} There was a problem, please try again later`)
                .then(msgReply => {
                  msgReply.delete(60000);
                });
              }
            })

      }
      break;

    case 'gwentup' :
      msg.channel.send(msg.member, {embed: {
        color: 0xdfda13,
        url: `https://gwentup.com/?` + getUtmTags(msg),
        description: `The following commands are available\n
        `,
        fields: [
          {name: '!profile %nickname% - Request of profile', value: `ex: !profile boukers`},
          {
            name: '!gwentup',
            value: `Support us and get bonuses on [patreon](http://patreon.com/gwentup)`
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: icon,
          text: `© Gwentup`
        }
      }
      })
      .then(msgReply => {
        msgReply.delete(180000);
      })
      .catch( err =>{
        logger.info();
        logger.info(chalk.bold("---------------------[ Message Error at %s Uptime: %s ]---------------------------"),
          moment().format("YYYY-MM-DD HH:mm:ss.SSS"), moment.duration(process.uptime() * 1000).humanize());
        logger.info(chalk.bold("Error Message: ") + err.reason);
        console.log(err);
        logger.info(chalk.bold("Error code: ") + err.code);
      });
      break;
  }

});

function getUtmTags(msg) {
  let result = 'utm_source=discord';
  if (msg && msg.guild) {
    result += '&utm_campaign=' + encodeURIComponent(msg.guild.name);
    if (msg.channel) {
      result += '&utm_content=' + encodeURIComponent(msg.channel.name);
    }
  }
  return result;
}


module.exports = {
  client
};

