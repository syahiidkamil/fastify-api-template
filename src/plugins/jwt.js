// src/plugins/jwt.js
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';

export default fp(async function(fastify, opts) {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET
  });

  fastify.decorate('authenticate', async function(request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });
});