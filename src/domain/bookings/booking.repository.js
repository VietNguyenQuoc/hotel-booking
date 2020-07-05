const { Sequelize, Booking, Room } = require('../../infra/db/sequelize/models');
const { Op } = Sequelize;

const getBookingsByUserId = async userId => {
  return await Booking.findAll({ where: { userId } });
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
      [Op.or]: [
        { checkInDate: { [Op.and]: [{ [Op.gte]: fromDate }, { [Op.lt]: toDate }] } },
        { checkOutDate: { [Op.and]: [{ [Op.gt]: fromDate }, { [Op.lte]: toDate }] } },
        {
          [Op.and]: [
            { checkInDate: { [Op.lte]: fromDate } },
            { checkOutDate: { [Op.gt]: fromDate } },
          ]
        }
      ]
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
      [Op.or]: [
        { checkInDate: { [Op.and]: [{ [Op.gte]: fromDate }, { [Op.lt]: toDate }] } },
        { checkOutDate: { [Op.and]: [{ [Op.gt]: fromDate }, { [Op.lte]: toDate }] } },
        {
          [Op.and]: [
            { checkInDate: { [Op.lte]: fromDate } },
            { checkOutDate: { [Op.gt]: fromDate } },
          ]
        }
      ]
    }
  })
}

const updateBooking = async (bookingDto, opts) => {
  return await Booking.update(bookingDto, opts)
}


module.exports = {
  createBooking,
  countBookedRoomsOnRangeDate,
  getBookingsByRoomTypeAndRangeDate,
  getBookingsByUserId,
  updateBooking
}