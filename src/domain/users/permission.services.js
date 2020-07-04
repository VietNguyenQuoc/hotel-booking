const permissionRepository = require('./permission.repository');

const createPermission = async (name, description) => {
  return await permissionRepository.createPermission({ name, description });
}

const getAllPermissions = async () => {
  return await permissionRepository.getAllPermissions();
}

const grantPermissions = async (roleId, permissionIds) => {
  await permissionRepository.deleteAllRolePermissionsByRole(roleId);
  const rolePermissionDtos = permissionIds.map(id => ({ roleId, permissionId: id }));
  await permissionRepository.bulkCreateRolePermissions(rolePermissionDtos);
}

module.exports = {
  createPermission,
  getAllPermissions,
  grantPermissions
}