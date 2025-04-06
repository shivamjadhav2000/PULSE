const express = require('express');
const router = express.Router();
const checkAdmin = require('@middleware/checkAdmin'); // Adjust the path as needed
router.use('/admin', checkAdmin,require('./admin'));
router.use('/common', require('./common'));

router.use('/auth', require('./auth'));
module.exports = router;