'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RoomTypes', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.ENUM('Single', 'Double', 'Triple', 'Quad', 'Queen', 'King', 'Twin', 'Double-double'),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT
      },
      images: {
        type: Sequelize.JSON
      },
      quantity: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false
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

    await queryInterface.addIndex('RoomTypes', { fields: ['price'] });
  },
  down: (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('RoomTypes');
  }
};
