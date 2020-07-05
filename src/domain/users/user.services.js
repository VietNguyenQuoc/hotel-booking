const userRepository = require('./user.repository');
const userCredentialRepository = require('./userCredential.repository');
const roleRepository = require('./role.repository');
const roleErrors = require('./role.errors');
const { Sequelize: { Op } } = require('../../infra/db/sequelize/models');

const createUser = async userDto => {
  return await userRepository.createUser({ userDto });
}

const getUsers = async () => {
  return await userRepository.getUsers();
}

const getUserById = async (userId, role, permission) => {
  return await userRepository.getUserById(userId, role, permission);
}

const getUserByEmail = async email => {
  return await userRepository.getUserByEmail({ email });
}

const updateUser = async userDto => {
  return await userRepository.updateUser({ userDto });
}

const deleteUser = async userId => {
  return await userRepository.deleteUser({ userId });
}

const findOrCreateUser = async ({ email, defaultValues }) => {
  return await userRepository.findOrCreateUser({ email, defaultValues });
}

const findOrCreateUserCredential = async ({ externalId, defaultValues }) => {
  return await userCredentialRepository.findOrCreateUserCredential({ externalId, defaultValues });
}

const changeRole = async (email, roleId) => {
  const superAdminRole = roleRepository.getRoleByName('super_admin');

  const role = await roleRepository.getRoleById(roleId);
  if (!role) throw Error(roleErrors.ROLE_NOT_EXISTS);

  await userRepository.updateUserByEmail(
    email,
    { roleId },
    {
      roleId: {
        [Op.not]: superAdminRole.id
      }
    });
}

const changePassword = async (userId, password) => {
  return await userCredentialRepository.updatePassword(userId, password);
}

const getUserRoleById = async userId => {
  const user = await userRepository.getUserById(userId, true);
  return user.Role.name;
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getUsers,
  updateUser,
  deleteUser,
  findOrCreateUser,
  findOrCreateUserCredential,
  changeRole,
  changePassword,
  getUserRoleById
};