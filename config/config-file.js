const fs = require('fs');

/**
 * @typedef {object} Config
 * @property {number} port
 * @property {string} discord_secret
 * @property {string} ip
 * @property {string} redis_uri
 */

/**
 * @type {Config}
 */

module.exports = JSON.parse(fs.readFileSync('config/config.json'));