module.exports = ({
  email,
  firstName,
  lastName,
  confirm = false,
  roleId,
}) => {
  return ({
    email,
    firstName,
    lastName,
    confirm,
    roleId,
  });
}