const prisma = require('../db/prisma');

const BookService = {
  createBook: async (data) => {
    return await prisma.livre.create({ 
      data: {
        titre: data.titre,
        auteur: data.auteur,
        annee: data.annee,
        genre: data.genre
      }
    });
  },

  getAllBooks: async () => {
    return await prisma.livre.findMany();
  },

  borrowBook: async (userId, livreId) => {
    return await prisma.$transaction(async (tx) => {
      const livre = await tx.livre.findUnique({ where: { id: parseInt(livreId) } });
      if (!livre) throw new Error('BOOK_NOT_FOUND');
      if (!livre.disponible) throw new Error('NOT_AVAILABLE');
      await tx.livre.update({
        where: { id: parseInt(livreId) },
        data: { disponible: false }
      });
      return await tx.emprunt.create({
        data: { 
          userId: userId, 
          livreId: parseInt(livreId) 
        }
      });
    });
  },

  getUserEmprunts: async (userId) => {
    return await prisma.emprunt.findMany({
      where: { userId },
      include: { livre: true }
    });
  }
};

module.exports = BookService;