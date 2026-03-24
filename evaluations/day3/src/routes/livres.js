const express = require('express');
const router = express.Router();
const livresController = require('../controllers/livresController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { createBookSchema } = require('../validators/livreValidator');

/**
 * @swagger
 * /api/livres:
 *   get:
 *     summary: Recuperer tous les livres
 *     tags: [Livres]
 *     responses:
 *       200:
 *         description: Liste des livres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Livre'
 */
router.get('/', livresController.getAll);

/**
 * @swagger
 * /api/livres/{id}:
 *   get:
 *     summary: Recuperer un livre par son ID
 *     tags: [Livres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livre trouve
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livre'
 *       404:
 *         description: Livre non trouve
 */
router.get('/:id', livresController.getById);

/**
 * @swagger
 * /api/livres:
 *   post:
 *     summary: Creer un nouveau livre
 *     tags: [Livres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Livre'
 *     responses:
 *       201:
 *         description: Livre cree
 *       401:
 *         description: Non authentifie
 *       400:
 *         description: Donnees invalides
 */
router.post(
  '/',
  authenticate,
  validate(createBookSchema),
  livresController.create
);

/**
 * @swagger
 * /api/livres/{id}:
 *   put:
 *     summary: Mettre a jour un livre
 *     tags: [Livres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Livre'
 *     responses:
 *       200:
 *         description: Livre mis a jour
 *       401:
 *         description: Non authentifie
 *       404:
 *         description: Livre non trouve
 */
router.put(
  '/:id',
  authenticate,
  validate(createBookSchema),
  livresController.update
);

/**
 * @swagger
 * /api/livres/{id}:
 *   delete:
 *     summary: Supprimer un livre (Admin uniquement)
 *     tags: [Livres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livre supprime
 *       401:
 *         description: Non authentifie
 *       403:
 *         description: Acces refuse - Admin requis
 *       404:
 *         description: Livre non trouve
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  livresController.delete
);

module.exports = router;