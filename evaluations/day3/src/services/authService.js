const prisma = require('../db/prisma');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const authService = {
  register: async (userData) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });
    if (existingUser) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await prisma.user.create({
      data: {
        nom: userData.nom,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || "USER"
      }
    });

    return {
      id: newUser.id,
      nom: newUser.nom,
      email: newUser.email,
      role: newUser.role
    };
  },

  login: async (email, password) => {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return {
      user: { id: user.id, nom: user.nom, email: user.email, role: user.role },
      accessToken,
      refreshToken
    };
  },

  refresh: async (token) => {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
    
    const tokenInDb = await prisma.refreshToken.findUnique({
      where: { token }
    });

    if (!tokenInDb || tokenInDb.expiresAt < new Date()) {
      throw new Error('REFRESH_TOKEN_INVALID');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) throw new Error('INVALID_CREDENTIALS');

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return { accessToken };
  },

  logout: async (token) => {
    await prisma.refreshToken.deleteMany({
      where: { token }
    });
  },

  getMe: async (userId) => {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, nom: true, email: true, role: true }
    });
  }
};

module.exports = authService;