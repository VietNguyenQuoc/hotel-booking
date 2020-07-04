module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    roleId: DataTypes.INTEGER,
    confirm: DataTypes.BOOLEAN,
  }, {});

  User.associate = function (models) {
    User.hasMany(models.UserCredential);
    User.belongsTo(models.UserRole, { as: 'Role', foreignKey: 'roleId' });
    User.belongsToMany(models.RoomType, { through: models.Booking, foreignKey: 'userId' });
  };

  return User;
}