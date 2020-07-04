const router = require('express').Router();

router.use('/users', require('../domain/users/user.cms.controllers'));
router.use('/rooms', require('../domain/rooms/room.cms.controllers'));

module.exports = router;