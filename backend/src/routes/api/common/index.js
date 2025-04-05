const router= require('express').Router()
const mongoose = require('mongoose')
router.use('/users', require('./users'))

module.exports = router