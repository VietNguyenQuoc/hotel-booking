const userRepository = require('../../users/user.repository');
const UserModel = require('../../users/user.model');
const userCredentialRepository = require('../../users/userCredential.repository');
const UserCredentialModel = require('../../users/userCredential.model');
const authenticationErrors = require('../authentication.errors');
const facebookService = require('./facebook');
const githubService = require('./github');
const googleService = require('./google');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../../../infra/logger');
const sendMail = require('../../../infra/services/mailer');
const generateToken = require('../../../infra/utils/generateToken');
const verifyToken = require('../../../infra/utils/verifyToken');
const redisClient = require('../../../infra/db/redis');

const signUp = async ({ email, password, firstName, lastName }, opts = {}) => {
  const isSignUp = await userRepository.getUserByEmail(email);
  if (isSignUp) throw Error(authenticationErrors.EMAIL_EXISTS);

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const userRole = await userRepository.getRoleByName('user');
  const userDto = UserModel({ email, firstName, lastName, roleId: userRole.id });
  let returnMessage;

  if (opts.needVerify) {
    userDto.confirm = false;
    returnMessage = `We will send you an email to ${email} to confirm the registration.`;

    const verifyToken = generateToken({ email }, { expiresIn: '30m' });
    sendMail({
      from: '2359Media',
      to: email,
      subject: 'Verification account',
      html: `<p>Click to <a href=${process.env.SERVER_URL}:${process.env.PORT}/auth/verify?code=${verifyToken}>this link</a> to verify account: </p> `
    });
  } else {
    userDto.confirm = true
    returnMessage = `Your registration is completed successfully. Please login.`
  }
  const user = await userRepository.createUser(userDto);
  const userCredentialDto = UserCredentialModel({ UserId: user.id, ExternalType: 'password', ExternalId: hashPassword });
  userCredentialRepository.createUserCredential(userCredentialDto);

  return returnMessage;
}

const login = async ({ email, password }) => {
  const user = await userRepository.getUserByEmailWithCredentials(email);
  if (!user) throw Error(authenticationErrors.INVALID_CREDENTIAL);

  const hashedPassword = user.UserCredentials.find(e => e.ExternalType === 'password').ExternalId;
  const isValid = await bcrypt.compare(password, hashedPassword);
  if (!isValid) throw Error(authenticationErrors.INVALID_CREDENTIAL);
  if (!user.confirm) throw Error(authenticationErrors.EMAIL_NOT_VERIFIED);

  const permissions = user.Role.Permissions.map(e => e.name);

  const accessToken = generateToken({ userId: user.id, permissions }, { expiresIn: '30m' });
  const refreshToken = generateToken({ userId: user.id, permissions }, { expiresIn: '7d' });
  redisClient.zadd(`tokens:${user.id}`, Date.now() + 7 * 24 * 60 * 60 * 1000, refreshToken);
  // Flush all the expired gabage tokens
  redisClient.zremrangebyscore(`tokens:${user.id}`, '-inf', Date.now());

  return { accessToken, refreshToken };
}

const verify = async (token) => {
  try {
    const { email } = verifyToken(token);
    const user = await userRepository.getUserByEmail(email);
    if (user.confirm) throw Error(authenticationErrors.INVALID_RESEND_VERIFY);

    userRepository.updateUserByEmail(email, { confirm: true });
  } catch (e) {
    if (e.message.match(/expire/)) {
      throw Error(authenticationErrors.VERIFY_CODE_EXPIRE);
    }
    if (e.message.match(/signature/)) {
      throw Error(authenticationErrors.INVALID_VERIFY_CODE);
    }
    throw e;
  }
}

const resendVerifyToken = async email => {
  const user = await userRepository.getUserByEmail(email);
  if (user.confirm) throw Error(authenticationErrors.INVALID_RESEND_VERIFY);

  const verifyToken = generateToken({ email }, { expiresIn: '30m' });
  sendMail({
    from: '2359Media',
    to: email,
    subject: 'Verification account',
    html: `<p>Click to <a href=${process.env.SERVER_URL}:${process.env.PORT}/auth/verify?token=${verifyToken}>this link</a> to verify account: </p> `
  });
}

const forgetPassword = async email => {
  try {
    const user = await userRepository.getUserByEmailWithCredentials(email);
    const { ExternalId: oldPasswordHash } = user.UserCredentials.find(c => c.ExternalType === 'password');

    const resetPasswordToken = generateResetPasswordToken({ email }, oldPasswordHash, { expiresIn: '1d' });
    sendMail({
      from: '2359Media',
      to: email,
      subject: 'Reset password',
      html: `<p>Click to <a href=${process.env.SERVER_URL}:${process.env.PORT}/auth/reset?token=${resetPasswordToken}>this link</a> to reset password</p> `
    });
  } catch (e) {
    console.log(e.message);
  }
}

const resetPassword = async ({ token, password, confirmPassword }) => {
  // Check if the token is expired
  if (password !== confirmPassword) throw Error(authenticationErrors.INVALID_CONFIRM_PASSWORD);

  const { email } = await verifyResetPasswordToken(token).catch(e => {
    if (e.message.match(/expire/)) {
      throw Error(authenticationErrors.VERIFY_CODE_EXPIRE);
    }
    if (e.message.match(/signature/)) {
      throw Error(authenticationErrors.INVALID_RESET_PASSWORD_TOKEN);
    }
  });

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const user = await userRepository.getUserByEmail(email);
  userCredentialRepository.updateUserCredentialPassword(user.id, hashPassword);
}

const generateResetPasswordToken = (payload, oldPasswordHash, options) => {
  const token = jwt.sign(payload, oldPasswordHash, options);
  return token;
}

const verifyResetPasswordToken = async token => {
  const { email } = jwt.decode(token);

  const user = await userRepository.getUserByEmailWithCredentials(email);
  const { ExternalId: currentPassword } = user.UserCredentials.find(c => c.ExternalType === 'password');

  try {
    // If the password has been changed successfully, the reset URL will become invalid.
    return jwt.verify(token, currentPassword);
  } catch (e) {
    if (e.message.match(/expire/)) {
      throw Error(authenticationErrors.RESET_PASSWORD_TOKEN_EXPIRED)
    }
    throw Error(authenticationErrors.INVALID_RESET_PASSWORD_TOKEN);
  }
}

const logout = (userId, token) => {
  redisClient.zrem(`tokens:${userId}`, token);
}

const logoutAllDevices = (userId) => {
  redisClient.del(`tokens:${userId}`);
}

const refreshTokens = (userId, refreshToken) => {
  const newAccessToken = generateToken({ userId }, { expiresIn: '30m' });
  const newRefreshToken = generateToken({ userId }, { expiresIn: '7d' });

  // Invalidate old refresh token
  redisClient.zrem(`tokens:${userId}`, refreshToken);
  // Add new refresh token to session manager
  redisClient.zadd(`tokens:${userId}`, Date.now() + 7 * 24 * 60 * 60 * 1000, newRefreshToken);
  return { accessToken: newAccessToken, refreshToken: newRefreshToken }
}

module.exports = {
  facebook: facebookService,
  github: githubService,
  google: googleService,
  signUp,
  login,
  logout,
  logoutAllDevices,
  verify,
  resendVerifyToken,
  forgetPassword,
  resetPassword,
  verifyResetPasswordToken,
  generateResetPasswordToken,
  refreshTokens,
}