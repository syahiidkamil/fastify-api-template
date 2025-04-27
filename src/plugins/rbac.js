// src/plugins/rbac.js
import fp from 'fastify-plugin';

export default fp(async function(fastify, opts) {
  // Define the checkRole middleware
  fastify.decorate('checkRole', (requiredRoles) => {
    return async (request, reply) => {
      try {
        // First verify the JWT
        await request.jwtVerify();
        
        // JWT is valid, now check if the user has the required role
        const user = await fastify.prisma.user.findUnique({
          where: { id: request.user.id }
        });
        
        if (!user) {
          return reply.status(401).send({ error: 'User not found' });
        }
        
        // Check if user's role is in the list of required roles
        if (!requiredRoles.includes(user.role)) {
          return reply.status(403).send({ 
            error: 'Insufficient permissions',
            message: `This action requires one of these roles: ${requiredRoles.join(', ')}`
          });
        }
        
        // Store user role in request for later use
        request.user.role = user.role;
        
      } catch (err) {
        reply.status(401).send({ error: 'Unauthorized' });
      }
    };
  });

  // Special middleware for SUPER_ADMIN creation
  fastify.decorate('allowSuperAdminCreation', () => {
    return async (request, reply) => {
      const superAdminKey = process.env.SUPER_ADMIN_KEY;
      
      if (!superAdminKey) {
        return reply.status(500).send({ error: 'Server configuration error' });
      }
      
      const providedKey = request.headers['x-super-admin-key'];
      
      if (!providedKey || providedKey !== superAdminKey) {
        return reply.status(403).send({ 
          error: 'Forbidden',
          message: 'Invalid or missing super admin key in headers'
        });
      }
    };
  });
});