// src/server.js
const buildApp = require('./app');
require('dotenv').config();

const app = buildApp({
  // We'll override the default Fastify logging behavior
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
        colorize: true,
        // Customize log output
        messageFormat: '{msg}',
        // Suppress the default Fastify startup messages
        suppressFlushSyncWarning: true
      }
    },
    // Disable default listen logs that show all bound addresses
    disableRequestLogging: true
  }
});

const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await app.listen({ port, host: '0.0.0.0' });
    
    // Custom formatted server startup message
    const serverUrl = `http://localhost:${port}`;
    const docsUrl = `${serverUrl}/documentation`;
    const apiUrl = `${serverUrl}/api`;
    
    // Clear console and show a neat banner
    console.clear();
    app.log.info('='.repeat(60));
    app.log.info(`✅ Server successfully started!`);
    app.log.info(`🚀 Server running at: ${serverUrl}`);
    app.log.info(`📚 API Documentation: ${docsUrl}`);
    app.log.info(`🔌 API Endpoints: ${apiUrl}`);
    app.log.info(`🔍 Health Check: ${serverUrl}/health`);
    app.log.info('='.repeat(60));
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();