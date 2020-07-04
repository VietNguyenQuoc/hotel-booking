const { sequelize, User, UserCredential, UserRole, Permission, RolePermission } = require('../../infra/db/sequelize/models');

const createUser = async userDto => {
  return await User.create(userDto);
}

const getUsers = async () => {
  return await User.findAll();
}

const getUserById = async (userId, role = false, permission = false) => {
  let where = {};
  if (role === true) {
    where.include = [{
      model: UserRole,
      as: 'Role'
    }];
    if (permission === true) {
      where.include[0].include = Permission;
    }
  }
  return await User.findByPk(userId, where);
}

const getUserByEmail = async (email, options) => {
  return await User.findOne({
    where: { email },
    ...options
  });
}

const getUserByEmailWithCredentials = async (email) => {
  return await User.findOne({
    where: { email },
    include: [
      {
        model: UserCredential,
      },
      {
        model: UserRole,
        as: 'Role',
        include: Permission
      }
    ]
  });
}

const updateUserByEmail = async (email, userDto, where) => {
  await User.update(userDto, {
    where: { email, ...where }
  });
}

const deleteUser = async userId => {
  await User.delete({ where: { id: userId } });
}

const truncateUsers = async () => {
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  await User.truncate();
}

const findOrCreateUser = async ({ email, defaultValues }) => {
  return await User.findCreateFind({
    where: { email },
    defaults: {
      email: email,
      lastName: defaultValues.lastName,
      firstName: defaultValues.firstName,
    }
  });
}

const getRoleByName = async roleName => {
  return await UserRole.findOne({ where: { name: roleName } });
}

module.exports = {
  createUser,
  getUserById,
  getUsers,
  getUserByEmail,
  getUserByEmailWithCredentials,
  updateUserByEmail,
  deleteUser,
  truncateUsers,
  findOrCreateUser,
  getRoleByName,
};