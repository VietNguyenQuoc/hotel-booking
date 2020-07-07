const router = require('express').Router();

router.use('/admin', require('../domain/users/admin.cms.controllers'));
router.use('/users', require('../domain/users/user.cms.controllers'));
router.use('/rooms', require('../domain/rooms/room.cms.controllers'));

module.exports = router;