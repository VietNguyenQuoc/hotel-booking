const router = require('express').Router();
const userServices = require('./user.services');
const permissionServices = require('./permission.services');
const permissionErrors = require('./permission.errors');
const roleServices = require('./role.services');

router.get('/permissions', async (_req, res) => {
  const permissions = await permissionServices.getAllPermissions();
  return res.status(200).send(permissions);
})

router.post('/permissions', async (req, res) => {
  const { name, description } = req.body;

  permissionServices.createPermission(name, description)
    .then((permission) => { return res.status(200).send(permission) })
    .catch((e) => { return res.status(400).send(e.message) });
});

router.post('/grantPermissions', async (req, res) => {
  const { roleId, permissionIds } = req.body;

  permissionServices.grantPermissions(roleId, permissionIds)
    .then(() => { return res.status(200).send('Grant permissions successfully.') })
    .catch(e => { return res.status(400).send(e.message) });
});

router.get('/roles', async (_req, res) => {
  const roles = await roleServices.getAllRoles();
  return res.status(200).send(roles);
});

router.post('/changeRole', async (req, res) => {
  const { email, roleId } = req.body;

  userServices.changeRole(email, roleId)
    .then(() => { return res.status(200).send(`Successfully change the role of ${email}. Please login again.`) })
    .catch(e => { return res.status(400).send(e.message) });
})


module.exports = router;