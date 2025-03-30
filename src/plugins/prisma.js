// src/plugins/prisma.js
const fp = require('fastify-plugin');
const { PrismaClient } = require('@prisma/client');

module.exports = fp(async function(fastify, opts) {
  const prisma = new PrismaClient();

  await prisma.$connect();

  // Make Prisma Client available through the fastify instance
  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect();
  });
});