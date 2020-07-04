module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    name: DataTypes.STRING,
  }, {});

  UserRole.associate = function (models) {
    UserRole.belongsToMany(models.Permission, { through: models.RolePermission, foreignKey: 'roleId' });
  };

  return UserRole;
}