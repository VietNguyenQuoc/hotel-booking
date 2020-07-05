module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    method: DataTypes.STRING,
    resource: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {});

  Permission.associate = function (models) {
    Permission.belongsToMany(models.UserRole, { as: 'Roles', through: models.RolePermission, foreignKey: 'permissionId' });
  };

  return Permission;
}