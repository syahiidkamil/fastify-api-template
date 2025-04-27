// src/modules/auth/handlers.js
import AuthService from './service.js';

async function register(request, reply) {
  const authService = new AuthService(this.prisma);
  
  try {
    const user = await authService.register(request.body);
    const token = this.jwt.sign({ id: user.id, email: user.email, role: user.role });
    
    return reply.code(201).send({ 
      user, 
      token
    });
  } catch (error) {
    request.log.error(error);
    
    if (error.statusCode) {
      return reply.code(error.statusCode).send({ 
        error: error.message 
      });
    }
    
    return reply.code(500).send({ 
      error: 'Internal server error' 
    });
  }
}

async function registerAdmin(request, reply) {
  const authService = new AuthService(this.prisma);
  
  try {
    const user = await authService.registerAdmin(request.body);
    
    return reply.code(201).send({ 
      user,
      message: 'Admin user created successfully'
    });
  } catch (error) {
    request.log.error(error);
    
    if (error.statusCode) {
      return reply.code(error.statusCode).send({ 
        error: error.message 
      });
    }
    
    return reply.code(500).send({ 
      error: 'Internal server error' 
    });
  }
}

async function registerSuperAdmin(request, reply) {
  const authService = new AuthService(this.prisma);
  
  try {
    const user = await authService.registerSuperAdmin(request.body);
    
    return reply.code(201).send({ 
      user,
      message: 'Super admin user created successfully'
    });
  } catch (error) {
    request.log.error(error);
    
    if (error.statusCode) {
      return reply.code(error.statusCode).send({ 
        error: error.message 
      });
    }
    
    return reply.code(500).send({ 
      error: 'Internal server error' 
    });
  }
}

async function login(request, reply) {
  const authService = new AuthService(this.prisma);
  
  try {
    const { email, password } = request.body;
    const user = await authService.login(email, password);
    const token = this.jwt.sign({ id: user.id, email: user.email, role: user.role });
    
    return reply.code(200).send({ 
      user, 
      token
    });
  } catch (error) {
    request.log.error(error);
    
    if (error.statusCode) {
      return reply.code(error.statusCode).send({ 
        error: error.message 
      });
    }
    
    return reply.code(500).send({ 
      error: 'Internal server error' 
    });
  }
}

async function getMe(request, reply) {
  try {
    const user = await this.prisma.user.findUnique({
      where: { id: request.user.id }
    });
    
    if (!user) {
      return reply.code(404).send({ 
        error: 'User not found' 
      });
    }
    
    const { password, ...userWithoutPassword } = user;
    return reply.code(200).send(userWithoutPassword);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ 
      error: 'Internal server error' 
    });
  }
}

async function updateRole(request, reply) {
  const authService = new AuthService(this.prisma);
  
  try {
    const { userId, role } = request.body;
    const updatedUser = await authService.updateUserRole(
      userId, 
      role, 
      request.user.role
    );
    
    return reply.code(200).send({
      user: updatedUser,
      message: `User role updated to ${role}`
    });
  } catch (error) {
    request.log.error(error);
    
    if (error.statusCode) {
      return reply.code(error.statusCode).send({ 
        error: error.message 
      });
    }
    
    return reply.code(500).send({ 
      error: 'Internal server error' 
    });
  }
}

async function listUsers(request, reply) {
  try {
    // Pagination parameters
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const users = await this.prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    const total = await this.prisma.user.count();
    
    return reply.code(200).send({
      users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ 
      error: 'Internal server error' 
    });
  }
}

export {
  register,
  registerAdmin,
  registerSuperAdmin,
  login,
  getMe,
  updateRole,
  listUsers
};