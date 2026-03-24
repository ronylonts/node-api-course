const prisma = require('../db/prisma');

const livreService = {
  getAll: async () => {
    return await prisma.livre.findMany();
  },

  getById: async (id) => {
    return await prisma.livre.findUnique({
      where: { id: parseInt(id) }
    });
  },

  create: async (data) => {
    return await prisma.livre.create({
      data: {
        titre: data.title,
        auteur: data.author,
        annee: data.year
      }
    });
  },

  update: async (id, data) => {
    return await prisma.livre.update({
      where: { id: parseInt(id) },
      data: {
        titre: data.title,
        auteur: data.author,
        annee: data.year
      }
    });
  },

  delete: async (id) => {
    return await prisma.livre.delete({
      where: { id: parseInt(id) }
    });
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
  }
};

module.exports = livreService;