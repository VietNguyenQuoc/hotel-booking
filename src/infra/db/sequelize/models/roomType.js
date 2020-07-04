module.exports = (sequelize, DataTypes) => {
  const RoomType = sequelize.define('RoomType', {
    name: {
      type: DataTypes.ENUM('Single', 'Double', 'Triple', 'Quad', 'Queen', 'King', 'Twin', 'Double-double'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    images: {
      type: DataTypes.JSON
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
  }, {});

  RoomType.associate = function (models) {
    RoomType.hasMany(models.Room, { foreignKey: 'roomTypeId' });
    RoomType.belongsToMany(models.User, { through: models.Booking, foreignKey: 'roomTypeId' });
  };

  return RoomType;
}