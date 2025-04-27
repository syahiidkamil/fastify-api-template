// src/modules/auth/routes.js
import * as handlers from './handlers.js';
import * as schemas from './schemas/index.js';

export default function authRoutes(fastify, options, done) {
  // Public routes
  fastify.post('/register', { 
    schema: schemas.registerSchema 
  }, handlers.register);
  
  fastify.post('/login', { 
    schema: schemas.loginSchema 
  }, handlers.login);
  
  // Authenticated routes
  fastify.get('/me', { 
    schema: schemas.getMeSchema,
    preHandler: [fastify.authenticate]
  }, handlers.getMe);
  
  // Admin routes
  fastify.post('/admin', { 
    schema: schemas.registerAdminSchema,
    preHandler: [fastify.checkRole(['SUPER_ADMIN'])]
  }, handlers.registerAdmin);
  
  fastify.post('/role', { 
    schema: schemas.updateRoleSchema,
    preHandler: [fastify.checkRole(['ADMIN', 'SUPER_ADMIN'])]
  }, handlers.updateRole);
  
  fastify.get('/users', { 
    schema: schemas.listUsersSchema,
    preHandler: [fastify.checkRole(['ADMIN', 'SUPER_ADMIN'])]
  }, handlers.listUsers);
  
  // Super Admin routes
  fastify.post('/super-admin', { 
    schema: schemas.registerSuperAdminSchema,
    preHandler: [fastify.allowSuperAdminCreation()]
  }, handlers.registerSuperAdmin);
  
  done();
}