const { z } = require('zod');

const createBookSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  auteur: z.string().min(1, "L'auteur est requis"),
  isbn: z.string().optional(),
  disponible: z.boolean().optional().default(true),
});

const updateBookSchema = createBookSchema.partial();

module.exports = { createBookSchema, updateBookSchema };