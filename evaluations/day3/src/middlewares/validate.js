const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Données invalides",
      errors: error.errors ? error.errors.map(e => e.message) : error.message
    });
  }
};

module.exports = validate;