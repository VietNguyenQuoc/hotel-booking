const { RoomType } = require('../../infra/db/sequelize/models');

const getAllRoomTypes = async () => {
  return await RoomType.findAll({ where: { deleted: false } });
}

const createRoomType = async (roomDto) => {
  return await RoomType.create(roomDto);
}

const updateRoomType = async (roomId, roomDto) => {
  return await RoomType.update(roomDto, { where: { id: roomId } });
}

const deleteRoomType = async (roomId) => {
  return await RoomType.update({ deleted: true }, { where: { id: roomId } });
}

module.exports = {
  getAllRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType,
}