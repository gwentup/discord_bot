
let config		= require("../config");
let logger 		= require("../core/logger");
let rp = require('request-promise');

let Discord = require('discord.js');

// Initialize Discord Bot
var client = new Discord.Client();

client.login(config.authKeys.discord.token);

client.on('ready', function (evt) {
  logger.info('Connected');
  logger.info(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  let message = msg.content;
  if (message.substring(0, 1) == '!') {
    var args = message.substring(1).split(' ');
    var cmd = args[0];
    args = args.splice(1);

    switch (cmd) {
      // !ping
      case 'ping':
        msg.channel.send('Pong.');
        break;
      case 'help':
        msg.channel.send({embed: {
          color: 3447003,
          author: {
            name: client.user.username,
            icon_url: client.user.avatarURL
          },
          title: `GwentUP stats bot`,

          url: `https://gwentup.com/`,
          description: "The following commands are available",
          fields: [
            {name: '!leaders [index] [year]', value: `Example: !leaders 6 18`}
          ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: "© Gwentup.com"
          }
        }
        });
        break;
      case 'leaders':
        let ss_index = args[0] ? args[0]: '6';
        let ss_year = args[1] ? args[1]: '18';
        var options = {
          uri: 'https://gwentup.com/api/report/report',
          qs: {
            year: ss_year,
            index: ss_index
          },
          headers: {
            'User-Agent': 'discord-bot'
          },
          json: true
        };
        var data = [];
        rp(options)
          .then(function (result) {
            let rep = result[1];
            if(rep.type === 'REPORT_SUCCESS'){
              data = rep.report.Data.Leaders[3];
              let leaderIds = rep.report.Data.Leaders[3].map( (e,idx) => {
                return e._id;
              });

              logger.info(`Fetching from: https://gwentup.com/api/cards/${leaderIds.join(',')}`)
              let opts2 = {
                uri: `https://gwentup.com/api/cards/${leaderIds.join(',')}`,
                headers: {
                  'User-Agent': 'discord-bot'
                },
                json: true // Automatically parses the JSON string in the response
              };
              return rp(opts2)
            }
            else return Promise.reject('There was a problem connecting to the API, try again in a few minutes')
          })
          .then( cardResponse => {
            let cardsData = cardResponse[0];
            if(cardsData.type === 'CARDS_SUCCESS'){
              let output = data.map( (ele, idx) => {
                return {
                  leaderId: ele._id,
                  leaderName: cardsData.cards[ele._id].Name,
                  faction: cardsData.cards[ele._id].FactionId,
                  winrate: ele.WinRate
                }
              });
              output.sort(function(a,b) {return (a.winrate < b.winrate) ? 1 : ((b.winrate < a.winrate) ? -1 : 0);} );

              msg.channel.send({embed: {
                color: 3447003,
                author: {
                  name: client.user.username,
                  icon_url: client.user.avatarURL
                },
                title: `Leaders from Meta Snapshot ${ss_index}`,
                url: `https://gwentup.com/report/18/${ss_index}`,
                description: "Leaders Meta report for year ${} and ",
                fields: output.map( e => { return {name: e.leaderName, value: `Winrate: ${e.winrate} %`}}),
                timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: "© Gwentup.com"
                }
              }
              });

            }
            else return Promise.reject('There was a problem connecting to the API, try again in a few minutes')
          })
          .catch(function (err) {
            // API call failed...
            logger.error('Problem!', err.error[0]);
            msg.channel.send('Something went wrong... please try again in a few minutes. ');

          });
    }
  }

});


client.on('error', (error) => {
  console.log('error', error)
  logger.info();
  logger.info(chalk.bold("---------------------[ Bot Error at %s Uptime: %s ]---------------------------"),
    moment().format("YYYY-MM-DD HH:mm:ss.SSS"), moment.duration(process.uptime() * 1000).humanize());
  logger.info(chalk.bold("Error Message: ") + error);

  return process.exit(0);
});
module.exports = {
  client
};

