// src/app.js
import fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import pino from 'pino';
import 'dotenv/config';

// Import plugins
import loggerPlugin from './plugins/logger.js';
import prismaPlugin from './plugins/prisma.js';
import jwtPlugin from './plugins/jwt.js';
import rbacPlugin from './plugins/rbac.js';

// Import routes
import authRoutes from './modules/auth/routes.js';
import productRoutes from './modules/products/routes.js';

// Logger configuration
function createLoggerConfig() {
  const TOKEN = process.env.LOGTAIL_SOURCE_TOKEN;
  const INGESTING_HOST = process.env.LOGTAIL_INGESTING_HOST || "logs.betterstack.com";
  const LOGGER_FILE = process.env.LOGGER_FILE;

  if (TOKEN) {
    return {
      transport: {
        targets: [
          {
            target: "@logtail/pino",
            options: {
              sourceToken: TOKEN,
              options: { endpoint: `https://${INGESTING_HOST}` },
            },
          },
          ...(LOGGER_FILE
            ? [
                {
                  target: "pino/file",
                  options: { destination: LOGGER_FILE },
                },
              ]
            : []),
          {
            target: "pino-pretty",
            options: {
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname",
              colorize: true,
            },
          },
        ]
      }
    };
  } else {
    return {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          colorize: true
        }
      }
    };
  }
}

export default function build(opts = {}) {
  // Merge default logger config with passed options
  const options = {
    logger: createLoggerConfig(),
    ...opts
  };
  
  const app = fastify(options);

  // Register plugins
  app.register(cors);
  app.register(loggerPlugin);
  app.register(prismaPlugin);
  app.register(jwtPlugin);
  app.register(rbacPlugin);

  // Swagger documentation
  app.register(swagger, {
    swagger: {
      info: {
        title: 'Fastify API',
        description: 'API documentation',
        version: '1.0.0'
      },
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
      }
    }
  });
  
  app.register(swaggerUi, {
    routePrefix: '/documentation',
  });

  // API routes with prefix
  app.register((apiInstance, opts, done) => {
    // Register routes within the /api prefix
    apiInstance.register(authRoutes, { prefix: '/auth' });
    apiInstance.register(productRoutes, { prefix: '/products' });
    
    done();
  }, { prefix: '/api' });

  // Health check (outside API namespace)
  app.get('/health', async (request, reply) => {
    return { status: 'ok' };
  });

  return app;
}