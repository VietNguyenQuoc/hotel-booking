const router = require('express').Router();
const bookingServices = require('./booking.services');
const bookingSchemas = require('../../infra/schemas/booking');
const validate = require('../../app/middlewares/validator');
const _ = require('lodash');
const logger = require('../../infra/logger');

router.get('/', async (req, res) => {
  const { userId } = req.userInfo;

  bookingServices.getUserBookings(userId)
    .then((bookings) => {
      return res.status(200).json(bookings.map(booking =>
        _.pick(booking, [
          'id',
          'roomTypeId',
          'roomIds',
          'quantity',
          'price',
          'checkInDate',
          'checkOutDate',
          'paymentMethod',
          'status',
          'createdAt',
          'updatedAt'
        ])
      ))
    })
    .catch(e => { return res.status(400).send(e.message) })
});

router.post('/', validate(bookingSchemas.createBooking), async (req, res) => {
  const { userId } = req.userInfo;
  const { roomTypeId, quantity, fromDate, toDate } = req.body;

  bookingServices.bookRoomOnRangeDate({ userId, roomTypeId, quantity, fromDate, toDate })
    .then(() => { return res.status(200).send("Book successful.") })
    .catch(e => { return res.status(400).send(e.message) })
});

router.post('/cancel', async (req, res) => {
  const { userId } = req.userInfo;
  const { bookingId } = req.body;

  bookingServices.cancelBooking(userId, bookingId)
    .then(() => { return res.status(200).send("Your booking is succesfully cancelled.") })
    .catch(e => { return res.status(400).send(e.message) })
});

router.put('/:id', validate(bookingSchemas.updateBooking), async (req, res) => {
  const { userId } = req.userInfo;
  const bookingId = parseInt(req.params.id, 10);
  const { roomTypeId, quantity, fromDate, toDate } = req.body;

  bookingServices.updateBooking({ bookingId, userId, roomTypeId, quantity, fromDate, toDate })
    .then(() => { return res.status(200).send("Your booking is succesfully updated.") })
    .catch(e => {
      logger.error(e.stack);
      return res.status(400).send(e.message)
    })
})

module.exports = router;