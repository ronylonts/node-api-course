const prisma = require('../db/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthService = {
  register: async (userData) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('AUTH_FAILED'); 
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await prisma.user.create({
      data: {
        nom: userData.nom,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || "user"
      }
    });
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'secret_key_123',
      { expiresIn: '24h' }
    );

    return {
      user: {
        id: newUser.id,
        nom: newUser.nom,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      },
      token
    };
  },

  login: async (email, password) => {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret_key_123',
      { expiresIn: '24h' }
    );

    return {
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role
      },
      token
    };
  }
};

module.exports = AuthService;