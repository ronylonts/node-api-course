const livreService = require('../services/livreService');

const livresController = {
  getAll: async (req, res, next) => {
    try {
      const livres = await livreService.getAll();
      res.json(livres);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const livre = await livreService.getById(req.params.id);
      if (!livre) return res.status(404).json({ message: "Livre non trouvé" });
      res.json(livre);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const { title, author, year } = req.body;
      const newLivre = await livreService.create({ title, author, year });
      res.status(201).json(newLivre);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, author, year } = req.body;
      const updatedLivre = await livreService.update(id, { title, author, year });
      res.json(updatedLivre);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      await livreService.delete(req.params.id);
      res.json({ message: "Livre supprimé avec succès" });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = livresController;