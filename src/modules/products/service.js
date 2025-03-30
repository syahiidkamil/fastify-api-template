// src/modules/products/service.js
const { createNotFoundError } = require('../../utils/errors');

class ProductService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAllProducts() {
    return this.prisma.product.findMany();
  }

  async getProductById(id) {
    const product = await this.prisma.product.findUnique({
      where: { id: Number(id) }
    });

    if (!product) {
      throw createNotFoundError('Product not found');
    }

    return product;
  }

  async createProduct(data) {
    return this.prisma.product.create({
      data
    });
  }

  async updateProduct(id, data) {
    // Check if product exists
    await this.getProductById(id);

    return this.prisma.product.update({
      where: { id: Number(id) },
      data
    });
  }

  async deleteProduct(id) {
    // Check if product exists
    await this.getProductById(id);

    return this.prisma.product.delete({
      where: { id: Number(id) }
    });
  }
}

module.exports = ProductService;