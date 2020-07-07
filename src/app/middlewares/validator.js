const Validation = require('validatorjs');

module.exports = validateRules => (req, res, next) => {
  const validation = new Validation(req, validateRules);
  if (validation.fails()) return res.status(400).send(validation.errors.all());

  next();
}