"use strict";

let pkg = require("../package.json");

module.exports = {
	app: {
		title: pkg.name + " [Test mode]"
	},

	hashSecret: "71IIYMzMb0egTaCvvdijhUajAOjsrurzyRX5ziskMk4",
	sessionSecret: "MB9x-hOkx-UdcCbOprxggu-Wv1PetuoqzBny1h8DULA",

	test: true
};

