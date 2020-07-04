'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Bookings', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      roomTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      roomIds: {
        type: Sequelize.JSON
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      price: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      checkInDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      checkOutDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      paymentMethod: {
        type: Sequelize.ENUM('Credit', 'Bank transfer', 'Check-out')
      },
      status: {
        type: Sequelize.ENUM('Active', 'Payment pending', 'Cancelled'),
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });

    await queryInterface.addIndex('Bookings', { fields: ['userId'] });
    await queryInterface.addIndex('Bookings', { fields: ['roomTypeId'] });
    await queryInterface.addIndex('Bookings', { fields: ['checkInDate'] });
    await queryInterface.addIndex('Bookings', { fields: ['checkOutDate'] });
    await queryInterface.addIndex('Bookings', { fields: ['roomTypeId', 'checkInDate', 'checkOutDate'] });
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('Bookings');
  }
};
