"use strict";

let path = require("path");
let pkg = require("../package.json");
let conf = require("./config-file");

module.exports = {
	app: {
		title: pkg.title,
		version: pkg.version,
		description: pkg.description,
		url: "http://localhost:" + (conf.port || 3000) + "/",
		//googleAnalyticsID: 'UA-xxxxx-x',
		contactEmail: "lrossy@gmail.com"
	},

	ip: conf.ip || "0.0.0.0",
	port: conf.port || 3000,

	rootPath: global.rootPath,
	dataFolder: path.join(global.rootPath, "data"),

	uploadLimit: 2 * 1024 * 1024, // 2MB

	test: false,

  authKeys: {
    discord: {
      "token": conf.discord_secret
    }
  },
  
	redis: {
		enabled: false,
		uri: conf.redis_uri || "redis://localhost:6379",
		options: null
	},

	cacheTimeout: 5 * 60, // 5 mins

	logging: {
		console: {
			level: "debug"
		},

		file: {
			enabled: false,
			path: path.join(global.rootPath, "logs"),
			level: "info",
			json: false,
			exceptionFile: true
		},

		graylog: {
			enabled: false
			// servers: [ { host: "192.168.0.174", port: 12201 } ]
		},

		papertrail: {
			enabled: false,
			host: null,
			port: null,
			level: "debug",
			program: "vem"
		},

		logentries: {
			enabled: false,
			token: null
		},

		loggly: {
			enabled: false,
			token: null,
			subdomain: null
		},

		logsene: {
			enabled: false,
			token: null
		},

		logzio: {
			enabled: false,
			token: null
		}

	},

	agendaTimer: "one minute"
};
