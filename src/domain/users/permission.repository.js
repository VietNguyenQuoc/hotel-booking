const { Permission, RolePermission } = require('../../infra/db/sequelize/models');
const permissionErrors = require('./permission.errors');

const getAllPermissions = async () => {
  return await Permission.findAll();
}

const createPermission = async permissionDto => {
  try {
    return await Permission.create(permissionDto);
  } catch (e) {
    throw Error(permissionErrors.PERMISSION_EXISTS);
  }
}

const bulkCreateRolePermissions = async rolePermissionDtos => {
  return await RolePermission.bulkCreate(rolePermissionDtos);
}

const deleteAllRolePermissionsByRole = async roleId => {
  return await RolePermission.destroy({ where: { roleId } });
}

module.exports = {
  createPermission,
  getAllPermissions,
  bulkCreateRolePermissions,
  deleteAllRolePermissionsByRole,
}