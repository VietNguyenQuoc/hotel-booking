const permissionRepository = require('./permission.repository');
const roleServices = require('./role.services');

const createPermission = async (method, resource) => {
  return await permissionRepository.createPermission({ method, resource });
}

const getAllPermissions = async () => {
  return await permissionRepository.getAllPermissions();
}

const grantPermissions = async (roleId, permissionIds) => {
  const rolePermissionDtos = permissionIds.map(id => ({ roleId, permissionId: id }));
  // Persist on DB and redis
  await Promise.all([
    permissionRepository.bulkCreateRolePermissions(rolePermissionDtos),
    roleServices.updateInMemoryRolePermission(roleId, permissionIds)
  ]);
}

const denyPermission = async (roleId, permissionId) => {
  // Delete on DB and redis
  await Promise.all([
    permissionRepository.deleteRolePermissionByRole(roleId, permissionId),
    roleServices.deleteInMemoryRolePermission(roleId, permissionId)
  ]);
}

module.exports = {
  createPermission,
  getAllPermissions,
  grantPermissions,
  denyPermission
}