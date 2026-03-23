const AuthService = require('../services/authService');
const { registerSchema } = require('../validators/authValidator');
const AuthController = {
  register: async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await AuthService.register(validatedData);
      return res.status(201).json(result);
      
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          message: "Données invalides", 
          errors: error.errors ? error.errors.map(e => e.message) : [error.message]
        });
      }
     
      if (error.message === 'AUTH_FAILED') {
        return res.status(409).json({ message: "Cet email est déjà utilisé." });
      }
      console.error("DEBUG_REGISTER_ERROR:", error); 
      
      return res.status(500).json({ message: "Une erreur est survenue sur le serveur." });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis." });
      }
      
      const result = await AuthService.login(email, password);
      return res.status(200).json(result);
      
    } catch (error) {
      if (error.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }
      
      console.error("DEBUG_LOGIN_ERROR:", error);
      return res.status(500).json({ message: "Une erreur est survenue sur le serveur." });
    }
  }
};

module.exports = AuthController;