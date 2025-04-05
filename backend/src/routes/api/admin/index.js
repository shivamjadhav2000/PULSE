const express = require('express');
const router = express.Router();
const validate = require('express-validator');
const { check, validationResult } = validate;

router.use('/organizations'
    
    , require('./organizations'));
router.use('/messages', require('./messages'));

module.exports = router;
