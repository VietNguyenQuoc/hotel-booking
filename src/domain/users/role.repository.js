const { UserRole, Permission } = require('../../infra/db/sequelize/models');

const getAllRoles = async () => {
  return await UserRole.findAll();
}

const getRoleById = async roleId => {
  return await UserRole.findByPk(roleId, { include: Permission });
}

const getRoleByName = async name => {
  return await UserRole.findOne({ where: { name } });
}

module.exports = {
  getAllRoles,
  getRoleById,
  getRoleByName,
}