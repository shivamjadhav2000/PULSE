const router = require('express').Router();
router.use('/crisis', require('./crisis'));
module.exports = router;