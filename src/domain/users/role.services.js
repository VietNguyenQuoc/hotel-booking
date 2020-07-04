const roleRepository = require('./role.repository');

const getAllRoles = async () => {
  return await roleRepository.getAllRoles();
}

// const getRoleById = async roleId => {
//   return await roleRepository.getRoleById(roleId);
// }

module.exports = {
  getAllRoles,
}
