const router = require('express').Router();
const bookingServices = require('./booking.services');

router.post('/', async (req, res) => {
  const { userId } = req.userInfo;
  const { roomTypeId, quantity, fromDate, toDate } = req.body;

  bookingServices.bookRoomOnRangeDate({ userId, roomTypeId, quantity, fromDate, toDate })
    .then(() => { return res.status(200).send("Book successful.") })
    .catch(e => { return res.status(400).send(e.message) })
});




module.exports = router;