const { Sequelize, Booking, RoomType } = require('../../infra/db/sequelize/models');
const { Op } = Sequelize;

const getBookingsByUserId = async userId => {
  return await Booking.findAll({ where: { userId } });
}

const getBookingById = async (id, opts = {}) => {
  return await Booking.findByPk(id, opts);
}

const createBooking = async (bookingDto) => {
  console.log(bookingDto);
  return await Booking.create(bookingDto);
}

const countBookedRoomsOnRangeDate = async (fromDate, toDate) => {
  return await Booking.findAll({
    attributes: ['roomTypeId', [Sequelize.fn('sum', Sequelize.col('quantity')), 'count']],
    where: {
      status: ['Active', 'Pending'],
      [Op.and]: [{ checkInDate: { [Op.lt]: toDate } }, { checkOutDate: { [Op.gt]: fromDate } }]
    },
    group: ['roomTypeId'],
    raw: true
  });
}

const getBookingsByRoomTypeAndRangeDate = async ({ roomTypeId, fromDate, toDate }) => {
  return await Booking.findAll({
    where: {
      roomTypeId,
      status: ['Active', 'Pending'],
      [Op.and]: [{ checkInDate: { [Op.lt]: toDate } }, { checkOutDate: { [Op.gt]: fromDate } }]
    },
  });
}

const updateBooking = async (id, bookingDto, opts = {}) => {
  return await Booking.update(bookingDto, {
    ...opts,
    where: { id }
  })
}


module.exports = {
  createBooking,
  countBookedRoomsOnRangeDate,
  getBookingsByRoomTypeAndRangeDate,
  getBookingsByUserId,
  updateBooking,
  getBookingById
}