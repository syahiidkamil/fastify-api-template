// src/modules/auth/service.js
const bcrypt = require('bcrypt');
const { createUnauthorizedError, createBadRequestError, createForbiddenError } = require('../../utils/errors');

class AuthService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async register(userData, role = 'CUSTOMER') {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw createBadRequestError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user with specified role
    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: role
      }
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async registerAdmin(userData, role = 'ADMIN') {
    // This is a separate method to register admins (can only be called by SUPER_ADMINs)
    return this.register(userData, role);
  }

  async registerSuperAdmin(userData) {
    // This is a separate method to register super admins (requires special header)
    return this.register(userData, 'SUPER_ADMIN');
  }

  async login(email, password) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw createUnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw createUnauthorizedError('Invalid email or password');
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUserRole(userId, newRole, currentUserRole) {
    // Only SUPER_ADMIN can update to any role
    // ADMIN can only update CUSTOMER roles
    if (currentUserRole !== 'SUPER_ADMIN' && 
        (newRole === 'SUPER_ADMIN' || newRole === 'ADMIN')) {
      throw createForbiddenError('Insufficient permissions to assign this role');
    }

    // Find user to update
    const userToUpdate = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userToUpdate) {
      throw createBadRequestError('User not found');
    }

    // ADMIN cannot change roles of other ADMINs or SUPER_ADMINs
    if (currentUserRole === 'ADMIN' && 
       (userToUpdate.role === 'ADMIN' || userToUpdate.role === 'SUPER_ADMIN')) {
      throw createForbiddenError('Cannot modify users with equal or higher role');
    }

    // Update the role
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}

module.exports = AuthService;