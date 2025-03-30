// src/modules/products/handlers.js
const ProductService = require('./service');

async function getAllProducts(request, reply) {
  const productService = new ProductService(this.prisma);
  
  try {
    const products = await productService.getAllProducts();
    return reply.code(200).send(products);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Internal server error' });
  }
}

async function getProductById(request, reply) {
  const productService = new ProductService(this.prisma);
  
  try {
    const product = await productService.getProductById(request.params.id);
    return reply.code(200).send(product);
  } catch (error) {
    request.log.error(error);
    
    if (error.statusCode) {
      return reply.code(error.statusCode).send({ error: error.message });
    }
    
    return reply.code(500).send({ error: 'Internal server error' });
  }
}

async function createProduct(request, reply) {
  const productService = new ProductService(this.prisma);
  
  try {
    const product = await productService.createProduct(request.body);
    return reply.code(201).send(product);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Internal server error' });
  }
}

async function updateProduct(request, reply) {
  const productService = new ProductService(this.prisma);
  
  try {
    const product = await productService.updateProduct(
      request.params.id, 
      request.body
    );
    return reply.code(200).send(product);
  } catch (error) {
    request.log.error(error);
    
    if (error.statusCode) {
      return reply.code(error.statusCode).send({ error: error.message });
    }
    
    return reply.code(500).send({ error: 'Internal server error' });
  }
}

async function deleteProduct(request, reply) {
  const productService = new ProductService(this.prisma);
  
  try {
    await productService.deleteProduct(request.params.id);
    return reply.code(204).send();
  } catch (error) {
    request.log.error(error);
    
    if (error.statusCode) {
      return reply.code(error.statusCode).send({ error: error.message });
    }
    
    return reply.code(500).send({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};