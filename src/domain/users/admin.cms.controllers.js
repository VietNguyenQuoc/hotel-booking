const router = require('express').Router();
const adminServices = require('./admin.services');

router.post('/create', async (req, res) => {
  const { email } = req.body;

  adminServices.createAdmin(email)
    .then(() => { return res.status(200).send('Create admin successfully.') })
    .catch(e => { return res.status(400).send(e.message) })
});

router.post('/delete', async (req, res) => {
  const { email } = req.body;

  adminServices.deleteAdmin(email)
    .then(() => { return res.status(200).send('Delete admin successfully.') })
    .catch(e => { return res.status(400).send(e.message) })
});

module.exports = router;