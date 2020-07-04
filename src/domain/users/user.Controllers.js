const router = require('express').Router();
const userServices = require('./user.services');

router.get('/me', async (req, res) => {
  const { userId } = req.userInfo;

  userServices.getUserById(userId)
    .then(user => res.status(200).send(user))
    .catch(e => res.status(400).send(e.message));
});

router.post('/changePassword', async (req, res) => {
  const { userId } = req.userInfo;
  const { password } = req.body;

  userServices.changePassword(userId, password)
    .then(() => { return res.status(200).send('Change password successfully.') })
    .catch(e => { return res.status(400).send(e.message) });
});

module.exports = router;