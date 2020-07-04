const { Sequelize, Booking, Room } = require('../../infra/db/sequelize/models');
const { Op } = Sequelize;

const countBookedRoomsOnRangeDate = async (fromDate, toDate) => {
  return await Booking.findAll({
    attributes: ['roomTypeId', [Sequelize.fn('sum', Sequelize.col('quantity')), 'count']],
    where: {
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

const createBooking = async (bookingDto) => {
  console.log(bookingDto);
  return await Booking.create(bookingDto);
}

module.exports = {
  createBooking,
  countBookedRoomsOnRangeDate,
  getBookingsByRoomTypeAndRangeDate
}