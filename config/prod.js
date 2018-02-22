"use strict";

let pkg 	= require("../package.json");

module.exports = {
	app: {
	},

  authKeys: {

    discord: {
      "token": process.env.discord_secret
    }
  }
};
