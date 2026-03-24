const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const { registerSchema, loginSchema } = require('../validators/authValidator');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - email
 *               - password
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Jean Dupont
 *               email:
 *                 type: string
 *                 example: jean@example.com
 *               password:
 *                 type: string
 *                 example: motdepasse123
 *     responses:
 *       201:
 *         description: Utilisateur cree avec succes
 *       400:
 *         description: Donnees invalides
 *       409:
 *         description: Email deja utilise
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: jean@example.com
 *               password:
 *                 type: string
 *                 example: motdepasse123
 *     responses:
 *       200:
 *         description: Connexion reussie, retourne un access token
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Renouveler l'access token via le refresh token (cookie)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Nouvel access token retourne
 *       401:
 *         description: Refresh token absent ou invalide
 */
router.post('/refresh', authController.refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Deconnexion et suppression du refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Deconnecte avec succes
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Recuperer le profil de l'utilisateur connecte
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *       401:
 *         description: Token absent ou invalide
 */
router.get('/me', authenticate, authController.me);

module.exports = router;