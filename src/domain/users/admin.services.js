const userRepository = require('./user.repository');
const roleRepository = require('./role.repository');
const authenticationServices = require('../authentication/authenticationService');
const userErrors = require('./user.errors');

const createAdmin = async email => {
  const { id: roleId } = await roleRepository.getRoleByName('admin');
  const user = await userRepository.getUserByEmail(email, { role: true });

  if (!user) {
    const randomPassword = '4wffhk2T@';
    await authenticationServices.signUp({ email, password: randomPassword, firstName: 'John', lastName: 'Doe' });
  } else if (user.Role.name !== 'user') {
    throw Error(userErrors.INVALID_ROLE_CHANGE);
  }

  return await userRepository.updateUserByEmail(email, { roleId });
}

const deleteAdmin = async email => {
  const user = await userRepository.getUserByEmail(email, { role: true });

  if (!user) {
    throw Error(userErrors.USER_NOT_EXISTS);
  }

  if (user.Role.name !== 'admin') {
    throw Error(userErrors.INVALID_ROLE_CHANGE);
  }

  // Revert account's role back to 'user'
  const { id: roleId } = await roleRepository.getRoleByName('user');
  return await userRepository.updateUserByEmail(email, { roleId });
}

module.exports = {
  createAdmin,
  deleteAdmin
}

