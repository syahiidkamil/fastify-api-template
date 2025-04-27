// src/plugins/logger.js
import fp from 'fastify-plugin';

// This plugin will enhance Fastify's existing logger rather than replace it
export default fp(function (fastify, opts, done) {
  // Log that we've initialized the logger
  fastify.log.info("Logger plugin registered");
  done();
}, {
  name: 'logger-plugin'
});