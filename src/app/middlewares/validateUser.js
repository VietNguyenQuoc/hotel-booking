const jwt = require('jsonwebtoken');
const redisClient = require('../../infra/db/redis');
const userServices = require('../../domain/users/user.services');

const validateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(400).send("Token is not provided.");

    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY, { algorithms: ['RS256'] });

    req.userInfo = decoded;
    next();
  } catch (e) {
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

module.exports = { validateUser, validateRefreshToken };