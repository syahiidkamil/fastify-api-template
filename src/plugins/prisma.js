// src/plugins/prisma.js
import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

export default fp(async function(fastify, opts) {
  const prisma = new PrismaClient();

  await prisma.$connect();

  // Make Prisma Client available through the fastify instance
  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect();
  });
});