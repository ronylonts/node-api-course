const authService = require('../services/authService');
const env = require('../config/env');

const authController = {
  register: async (req, res, next) => {
    try {
      const { nom, email, password, role } = req.body;
      const result = await authService.register({ nom, email, password, role });
      res.status(201).json(result);
    } catch (error) {
      if (error.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ message: "Identifiants incorrects" });
      }
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken, user } = await authService.login(email, password);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({ accessToken, user });
    } catch (error) {
      if (error.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ message: "Identifiants incorrects" });
      }
      next(error);
    }
  },

  refresh: async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.status(401).json({ message: "Refresh token manquant" });

      const { accessToken } = await authService.refresh(refreshToken);
      res.json({ accessToken });
    } catch (error) {
      if (error.message === 'INVALID_CREDENTIALS' || error.message === 'REFRESH_TOKEN_INVALID') {
        return res.status(401).json({ message: "Session expirée ou invalide" });
      }
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) await authService.logout(refreshToken);
      
      res.clearCookie('refreshToken');
      res.json({ message: "Déconnexion réussie" });
    } catch (error) {
      next(error);
    }
  },

  me: async (req, res, next) => {
    try {
      const user = await authService.getMe(req.user.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;