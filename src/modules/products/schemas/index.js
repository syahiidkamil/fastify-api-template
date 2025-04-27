// src/modules/products/schemas/index.js

const productSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

const getProductsSchema = {
  response: {
    200: {
      type: 'array',
      items: productSchema
    }
  }
};

const getProductSchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    }
  },
  response: {
    200: productSchema
  }
};

const createProductSchema = {
  body: {
    type: 'object',
    required: ['name', 'price'],
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' }
    }
  },
  response: {
    201: productSchema
  }
};

const updateProductSchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    }
  },
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' }
    }
  },
  response: {
    200: productSchema
  }
};

const deleteProductSchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    }
  },
  response: {
    204: {
      type: 'null'
    }
  }
};

export {
  productSchema,
  getProductsSchema,
  getProductSchema,
  createProductSchema,
  updateProductSchema,
  deleteProductSchema
};