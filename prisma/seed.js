// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  
  console.log('Seeding database...');

  // Create a super admin user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN'
    }
  });
  
  console.log(`Created super admin user: ${superAdmin.email}`);

  // Create some sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Classic Haircut',
        description: 'Traditional haircut with scissors and clippers',
        price: 25.99
      }
    }),
    prisma.product.create({
      data: {
        name: 'Beard Trim',
        description: 'Professional beard shaping and trimming',
        price: 15.50
      }
    }),
    prisma.product.create({
      data: {
        name: 'Deluxe Package',
        description: 'Includes haircut, beard trim, and hot towel treatment',
        price: 49.99
      }
    })
  ]);
  
  console.log(`Created ${products.length} sample products`);
  
  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
