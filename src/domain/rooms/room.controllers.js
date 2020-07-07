const router = require('express').Router();
const roomServices = require('./room.services');
const moment = require('moment');
const _ = require('lodash');
const validate = require('../../app/middlewares/validator');
const roomSchemas = require('../../infra/schemas/room');

router.get('/', validate(roomSchemas.getRooms), async (req, res) => {
  const { fromDate = moment() } = req.query;
  const { toDate = moment(fromDate).add(1, 'day') } = req.query;

  if (moment(fromDate) <= moment().subtract(1, 'day') || moment(fromDate) >= moment(toDate)) return res.status(400).send('Invalid fromDate and toDate');

  roomServices.getRoomTypesByRangeDate(moment(fromDate).format('YYYY-MM-DD'), moment(toDate).format('YYYY-MM-DD'))
    .then(rooms => {
      return res.status(200).json(rooms.map(room =>
        _.pick(room, ['id', 'name', 'price', 'quantity', 'description'])
      ))
    })
    .catch(e => { return res.status(400).send(e.message) });
});


module.exports = router;