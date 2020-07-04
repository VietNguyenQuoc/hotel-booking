'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RolePermissions', {
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      permissionId: {
        type: Sequelize.INTEGER,
        allowNull: false
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

    await queryInterface.addConstraint('RolePermissions', ['roleId', 'permissionId'], { type: 'PRIMARY KEY' });
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('RolePermissions');
  }
};
