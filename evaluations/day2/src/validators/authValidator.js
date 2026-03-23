const { z } = require('zod');

const registerSchema = z.object({
  nom: z.string().min(2, "Le nom doit avoir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
  role: z.string().optional() 
});

module.exports = { registerSchema };