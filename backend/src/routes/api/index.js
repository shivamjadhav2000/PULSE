const express = require('express');
const router = express.Router();
router.use('/admin', require('./admin'));
router.use('/common', require('./common'));
module.exports = router;