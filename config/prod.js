"use strict";

let pkg 	= require("../package.json");
let conf = require("./config-file");

module.exports = {
	app: {
	},

  authKeys: {

    discord: {
      "token": conf.discord_secret
    }
  }
};
