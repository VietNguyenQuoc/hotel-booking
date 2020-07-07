const bookingRepository = require('./booking.repository');
const bookingErrors = require('./booking.errors');
const roomServices = require('../rooms/room.services');
const moment = require('moment');

const getUserBookings = async (userId) => {
  return await bookingRepository.getBookingsByUserId(userId);
}

const bookRoomOnRangeDate = async ({ userId, roomTypeId, quantity, fromDate, toDate }) => {
  const availableRooms = await roomServices.getAvailableRoomsByRangeDate({ roomTypeId, quantity, fromDate, toDate });
  if (!availableRooms.length < quantity) {
    throw Error(bookingErrors.ROOM_NOT_AVAILABLE);
  }

  return await bookingRepository.createBooking({
    userId,
    roomTypeId,
    roomIds: availableRooms.map(room => room.id),
    quantity,
    price: availableRoomType.price,
    checkInDate: fromDate,
    checkOutDate: toDate,
    status: 'Active'
  });
}

const cancelBooking = async (userId, bookingId) => {
  const [count] = await bookingRepository.updateBooking({
    status: 'Cancelled'
  }, { where: { id: bookingId, userId } });

  if (!count) throw Error(bookingErrors.INVALID_BOOKING_ID);
}

const updateBooking = async ({ bookingId, userId, roomTypeId, quantity, fromDate, toDate }) => {
  const currentBooking = await bookingRepository.getBookingById(bookingId);
  if (_.isEqual(
    _.pick(currentBooking, ['userId', 'roomTypeId', 'quantity', 'checkInDate', 'checkOutDate']),
    { userId, roomTypeId, quantity, checkInDate: fromDate, checkOutDate: toDate }
  )) {
    throw Error(bookingErrors.UPDATE_BOOKING_NO_CHANGE);
  }


}

module.exports = {
  getUserBookings,
  bookRoomOnRangeDate,
  cancelBooking,
  updateBooking
}