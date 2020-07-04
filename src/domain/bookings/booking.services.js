const bookingRepository = require('./booking.repository');
const bookingErrors = require('./booking.errors');
const roomServices = require('../rooms/room.services');
const moment = require('moment');

const bookRoomOnRangeDate = async ({ userId, roomTypeId, quantity, fromDate, toDate }) => {
  const availableRoomTypes = await roomServices.getRoomsByRangeDate(fromDate, toDate);

  const availableRoomType = availableRoomTypes.find(r => r.id === roomTypeId);
  if (!availableRoomType) {
    throw Error(bookingErrors.ROOM_NOT_AVAILABLE);
  }
  if (availableRoomType.quantity < quantity) {
    throw Error(bookingErrors.ROOM_NOT_AVAILABLE);
  }

  const availableRooms = await roomServices.getAvailableRoomsByRangeDate({ roomTypeId, quantity, fromDate, toDate });
  if (!availableRooms.length) {
    throw Error(bookingErrors.ROOM_NOT_AVAILABLE);
  }
  return await bookingRepository.createBooking({
    userId,
    roomTypeId,
    roomIds: availableRooms.map(room => room.id),
    quantity,
    price: availableRoomType.price,
    checkInDate: fromDate,
    checkOutDate: toDate
  });
}

module.exports = {
  bookRoomOnRangeDate
}