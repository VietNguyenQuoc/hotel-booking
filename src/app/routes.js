const router = require('express').Router();
const jwtEncodeMiddleware = require('./middlewares/jwtEncode');
const { validateUser } = require('./middlewares/validateUser');

router.use('/auth', require('../domain/authentication/authentication.Controllers'));
router.use('/users', validateUser, require('../domain/users/user.Controllers'));
router.use('/rooms', validateUser, require('../domain/rooms/room.controllers'));
router.use('/booking', validateUser, require('../domain/bookings/booking.controllers'));

router.use('/cms', validateUser, require('./cms.routes'));
module.exports = router;