const router = require('express').Router();
const roomServices = require('./room.services');

router.get('/types', async (_req, res) => {
  const rooms = await roomServices.getAllRoomTypes();
  return res.status(200).send(rooms);
});

router.post('/types', async (req, res) => {
  const { name, quantity, price, images, description } = req.body;

  roomServices.createRoomType({ name, quantity, price, images, description })
    .then(room => { return res.status(200).send(room) })
    .catch(e => { return res.status(400).send(e.message) });
})

router.put('/types/:id', async (req, res) => {
  const roomTypeId = parseInt(req.params.id);
  const { name, quantity, price, images, description } = req.body;

  roomServices.updateRoomType(roomTypeId, { name, quantity, price, images, description })
    .then(() => { return res.status(200).send('Update room successfully') })
    .catch(e => { return res.status(400).send(e.message) });
});

router.delete('/types/:id', async (_req, res) => {
  const roomTypeId = parseInt(req.params.id);

  roomServices.deleteRoomType(roomTypeId)
    .then(() => { return res.status(200).send('Delete room successfully') })
    .catch(e => { return res.status(400).send(e.message) });
});


module.exports = router;