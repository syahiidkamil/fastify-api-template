// src/modules/products/routes.js
import * as handlers from './handlers.js';
import * as schemas from './schemas/index.js';

export default function productRoutes(fastify, options, done) {
  // Public routes - no authentication required
  fastify.get('/', { schema: schemas.getProductsSchema }, handlers.getAllProducts);
  fastify.get('/:id', { schema: schemas.getProductSchema }, handlers.getProductById);
  
  // Admin routes - requires ADMIN or SUPER_ADMIN role
  fastify.post('/', { 
    schema: schemas.createProductSchema,
    preHandler: [fastify.checkRole(['ADMIN', 'SUPER_ADMIN'])]
  }, handlers.createProduct);
  
  fastify.put('/:id', { 
    schema: schemas.updateProductSchema,
    preHandler: [fastify.checkRole(['ADMIN', 'SUPER_ADMIN'])]
  }, handlers.updateProduct);
  
  fastify.delete('/:id', { 
    schema: schemas.deleteProductSchema,
    preHandler: [fastify.checkRole(['SUPER_ADMIN'])]
  }, handlers.deleteProduct);
  
  done();
}