const roomTypeRepository = require('./roomType.repository');
const roomRepository = require('./room.repository');
// const bookingServices = require('../bookings/booking.services');
const bookingRepository = require('../bookings/booking.repository');
const _ = require('lodash');

const getAllRoomTypes = async () => {
  return await roomTypeRepository.getAllRoomTypes();
}

const getAvailableRoomsByRangeDate = async ({ roomTypeId, quantity, fromDate, toDate }) => {
  const [rooms, bookings] = await Promise.all([
    roomRepository.getRoomsByType(roomTypeId),
    bookingRepository.getBookingsByRoomTypeAndRangeDate({ roomTypeId, fromDate, toDate })
  ]);

  const bookingRoomIds = bookings.reduce((result, booking) => {
    return result.concat(booking.roomIds);
  }, []);
  const availableRoomIds = _.difference(
    rooms.map(r => r.id),
    bookingRoomIds
  ).slice(0, quantity);

  return rooms.filter(room => availableRoomIds.includes(room.id));
}

const getRoomsByRangeDate = async (fromDate, toDate) => {
  const [roomTypes, roomBookingsCount] = await Promise.all([
    roomTypeRepository.getAllRoomTypes(),
    bookingRepository.countBookedRoomsOnRangeDate(fromDate, toDate)
  ]);

  const availableRoomTypes = roomTypes.filter(type => {
    const roomBookingCount = parseInt(roomBookingsCount.find(e => e.roomTypeId === type.id)?.count || 0, 10);
    return type.quantity > roomBookingCount;
  });

  return availableRoomTypes.map(type => ({
    ..._.pick(type, ['id', 'type', 'description', 'price']),
    quantity: type.quantity - parseInt(roomBookingsCount.find(e => e.roomTypeId === type.id)?.count || 0, 10)
  }));
}

const createRoomType = async (roomDto) => {
  const roomType = await roomTypeRepository.createRoomType(roomDto);
  const roomDtos = new Array(roomDto.quantity).fill(null).map(_ => ({ roomTypeId: roomType.id }));
  // Automatically create rooms respectively to the type 
  await roomRepository.bulkCreateRooms(roomDtos);
  return roomType;
}

const updateRoomType = async (roomId, roomDto) => {
  return await roomTypeRepository.updateRoomType(roomId, roomDto);
}

const deleteRoomType = async (roomId) => {
  return await roomTypeRepository.deleteRoomType(roomId);
}

module.exports = {
  getAllRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType,
  getRoomsByRangeDate,
  getAvailableRoomsByRangeDate
}