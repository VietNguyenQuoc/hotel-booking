const roleRepository = require('./role.repository');
const permissionRepository = require('./permission.repository');
const roleErrors = require('./role.errors');
const permissionErrors = require('./permission.errors');

const getAllRoles = async (opts) => {
  return await roleRepository.getAllRoles(opts);
}

const getRoleById = async (roleId) => {
  return await roleRepository.getRoleById(roleId);
}

const getInMemoryRolePermissionsByRole = async roleName => {
  const permissions = await roleRepository.getInMemoryRolePermissionsByRole(roleName);
  return permissions.map(p => JSON.parse(p));
}
const updateInMemoryRolePermission = async (roleId, permissionIds) => {
  const role = await roleRepository.getRoleById(roleId);
  roleRepository.updateInMemoryRolePermission(
    role.name,
    ...role.Permissions
      .filter(p => permissionIds.includes(p.id))
      .map(p => JSON.stringify({
        method: p.method,
        resource: p.resource
      })));
}

const deleteInMemoryRolePermission = async (roleId, permissionId) => {
  const [role, permission] = await Promise.all([
    roleRepository.getRoleById(roleId),
    permissionRepository.getPermissionById(permissionId)
  ]);
  if (!role) throw Error(roleErrors.ROLE_NOT_EXISTS);
  if (!permissionId) throw Error(permissionErrors.PERMISSION_NOT_EXISTS);

  roleRepository.deleteInMemoryRolePermission(role.name, JSON.stringify(
    {
      method: permission.method,
      resource: permission.resource
    }));
}

module.exports = {
  getAllRoles,
  getRoleById,
  getInMemoryRolePermissionsByRole,
  updateInMemoryRolePermission,
  deleteInMemoryRolePermission
}
