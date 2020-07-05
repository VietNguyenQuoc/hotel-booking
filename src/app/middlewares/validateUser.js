const jwt = require('jsonwebtoken');
const logger = require('../../infra/logger');
const redisClient = require('../../infra/db/redis');
const userServices = require('../../domain/users/user.services');
const roleServcies = require('../../domain/users/role.services');
const { parse, match } = require('matchit');

const validateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(400).send("Token is not provided.");

    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY, { algorithms: ['RS256'] });

    const userRole = await userServices.getUserRoleById(decoded.userId);
    const userPermissions = await roleServcies.getInMemoryRolePermissionsByRole(userRole);
    const isOperable = userPermissions.some(({ method, resource }) => req.method === method && isValidResource(req.originalUrl, resource));
    if (!isOperable) throw Error();

    req.userInfo = decoded;
    next();
  } catch (e) {
    logger.error(e.message);
    return res.status(403).send("Not authorized.");
  }
}

const validateRefreshToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(400).send("Token is not provided.");

    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY, { algorithms: ['RS256'] });
    const isActiveToken = await redisClient.zscore(`tokens:${decoded.userId}`, token);
    if (!isActiveToken) throw Error();

    req.userInfo = decoded;
    req.userInfo.token = token;
    next();
  } catch (e) {
    return res.status(403).send("Not authorized.");
  }
}

function isValidResource(requestResource, permissionResource) {
  return match(requestResource, [parse(permissionResource)]).length ? true : false;
}

module.exports = { validateUser, validateRefreshToken };