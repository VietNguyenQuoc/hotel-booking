module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {});

  Permission.associate = function (models) {
    Permission.belongsToMany(models.UserRole, { through: models.RolePermission, foreignKey: 'permissionId' });
  };

  return Permission;
}