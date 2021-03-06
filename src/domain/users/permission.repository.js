const { Permission, RolePermission, UserRole } = require('../../infra/db/sequelize/models');
const permissionErrors = require('./permission.errors');

const getAllPermissions = async () => {
  return await Permission.findAll();
}

const getPermissionById = async id => {
  return await Permission.findByPk(id);
}

const getPermissionByIdWithRoles = async id => {
  return await Permission.findByPk(id, {
    include: { model: UserRole, as: 'Roles' }
  });
}

const createPermission = async permissionDto => {
  try {
    return await Permission.create(permissionDto);
  } catch (e) {
    throw Error(permissionErrors.PERMISSION_EXISTS);
  }
}

const deletePermission = async id => {
  return await Permission.destroy({ where: { id } });
}

const bulkCreatePermissions = async (bulkData) => {
  return await Permission.bulkCreate(bulkData);
}

const bulkCreateRolePermissions = async rolePermissionDtos => {
  return await RolePermission.bulkCreate(rolePermissionDtos, { ignoreDuplicates: true });
}

const deleteAllRolePermissionsByRole = async roleId => {
  return await RolePermission.destroy({ where: { roleId } });
}

const deleteRolePermissionByRole = async (roleId, permissionId) => {
  return await RolePermission.destroy({ where: { roleId, permissionId } });
}
const truncate = async () => {
  return await Permission.truncate();
}

module.exports = {
  createPermission,
  bulkCreatePermissions,
  getAllPermissions,
  getPermissionById,
  getPermissionByIdWithRoles,
  deletePermission,
  bulkCreateRolePermissions,
  deleteAllRolePermissionsByRole,
  deleteRolePermissionByRole,
  truncate
}