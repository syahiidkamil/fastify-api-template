// src/plugins/logger.js
const fp = require('fastify-plugin');

// This plugin will enhance Fastify's existing logger rather than replace it
module.exports = fp(function (fastify, opts, done) {
  // Log that we've initialized the logger
  fastify.log.info("Logger plugin registered");
  done();
}, {
  name: 'logger-plugin'
});