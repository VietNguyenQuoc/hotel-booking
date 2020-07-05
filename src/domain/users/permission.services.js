const permissionRepository = require('./permission.repository');
const roleServices = require('./role.services');
const roleRepository = require('./role.repository');

const createPermission = async (method, resource) => {
  return await permissionRepository.createPermission({ method, resource });
}

const getAllPermissions = async () => {
  return await permissionRepository.getAllPermissions();
}

const deletePermission = async id => {
  const permission = await permissionRepository.getPermissionByIdWithRoles(id);
  // Lookup and delete role's permissions in redis
  permission.Roles.map(role =>
    roleRepository.deleteInMemoryRolePermission(role.name, JSON.stringify({
      method: permission.method,
      resource: permission.resource
    }))
  );
  await permissionRepository.deletePermission(id);
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
  deletePermission,
  grantPermissions,
  denyPermission,
}