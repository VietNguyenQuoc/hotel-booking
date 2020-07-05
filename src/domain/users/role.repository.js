const { UserRole, Permission } = require('../../infra/db/sequelize/models');
const redisClient = require('../../infra/db/redis');

const getAllRoles = async (opts = {}) => {
  const options = {};
  if (opts.populate) {
    options.include = Permission;
  }
  return await UserRole.findAll(options);
}

const getRoleById = async roleId => {
  return await UserRole.findByPk(roleId, { include: Permission });
}

const getRoleByName = async name => {
  return await UserRole.findOne({ where: { name } });
}

const getInMemoryRolePermissionsByRole = async role => {
  return await redisClient.smembers(`permission:${role}`);
}

const updateInMemoryRolePermission = async (role, ...permissions) => {
  redisClient.sadd(`permission:${role}`, ...permissions);
}

const deleteInMemoryRolePermission = async (role, permission) => {
  redisClient.srem(`permission:${role}`, permission);
}

module.exports = {
  getAllRoles,
  getRoleById,
  getRoleByName,
  getInMemoryRolePermissionsByRole,
  updateInMemoryRolePermission,
  deleteInMemoryRolePermission
}