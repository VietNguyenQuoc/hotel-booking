module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    roomTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    roomIds: {
      type: DataTypes.JSON
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      allowNull: false,
      type: DataTypes.FLOAT
    },
    checkInDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    checkOutDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.ENUM('Credit', 'Bank transfer', 'Check-out')
    },
    status: {
      type: DataTypes.ENUM('Active', 'Payment pending', 'Cancelled'),
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
  }, {});

  Booking.associate = function (models) {
    Booking.belongsTo(models.RoomType, { foreignKey: 'roomTypeId' });
    Booking.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Booking;
}