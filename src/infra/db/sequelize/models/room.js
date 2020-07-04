module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    roomTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
  }, {});

  Room.associate = function (models) {
    Room.belongsTo(models.RoomType, { foreignKey: 'roomTypeId' });
  };

  return Room;
}