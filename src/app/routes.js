const router = require('express').Router();
const jwtEncodeMiddleware = require('./middlewares/jwtEncode');
const { validateUser } = require('./middlewares/validateUser');

router.use('/auth', require('../domain/authentication/authentication.Controllers'));
router.use('/users', validateUser, require('../domain/users/user.Controllers'));

module.exports = router;