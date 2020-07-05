const router = require('express').Router();
const roomServices = require('./room.services');
const moment = require('moment');
const _ = require('lodash');

router.get('/', async (req, res) => {
  const { fromDate = moment(), toDate } = req.query;

  if (!toDate) toDate = moment(fromDate).add(1, 'day');

  roomServices.getRoomsByRangeDate(moment(fromDate).format('YYYY-MM-DD'), moment(toDate).format('YYYY-MM-DD'))
    .then(rooms => {
      return res.status(200).json(rooms.map(room =>
        _.pick(room, ['id', 'name', 'price', 'quantity', 'description'])
      ))
    })
    .catch(e => { return res.status(400).send(e.message) });
});


module.exports = router;