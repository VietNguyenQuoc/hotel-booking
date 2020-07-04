const { Room } = require('../../infra/db/sequelize/models');

const getRoomsByType = async roomTypeId => {
  return await Room.findAll({ where: { roomTypeId: roomTypeId } });
}
const bulkCreateRooms = async (roomDtos) => {
  return await Room.bulkCreate(roomDtos);
}

module.exports = {
  getRoomsByType,
  bulkCreateRooms
}