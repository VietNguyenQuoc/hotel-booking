const router = require('express').Router();
const { User } = require('../../infra/db/sequelize/models');

router.get('/', async (req, res) => {
  const users = await User.findAll();
  return res.send(users);
})

module.exports = router;