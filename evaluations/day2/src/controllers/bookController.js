const BookService = require('../services/bookService');

const BookController = {
  add: async (req, res) => {
    try {
      const book = await BookService.createBook(req.body);
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'ajout" });
    }
  },

  list: async (req, res) => {
    try {
      const books = await BookService.getAllBooks();
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  },

  borrow: async (req, res) => {
    try {
      const emprunt = await BookService.borrowBook(req.user.id, parseInt(req.params.id));
      res.status(201).json(emprunt);
    } catch (error) {
      if (error.message === 'NOT_AVAILABLE') {
        return res.status(400).json({ message: "Livre non disponible" });
      }
      res.status(500).json({ message: "Erreur serveur" });
    }
  },

  myEmprunts: async (req, res) => {
    try {
      const list = await BookService.getUserEmprunts(req.user.id);
      res.status(200).json(list);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
};

module.exports = BookController;