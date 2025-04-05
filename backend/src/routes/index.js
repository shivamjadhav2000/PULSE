const express = require('express')
const router = express.Router()

router.use('/api', require('./api'))
router.get('/', (req, res) => {
    res.send('CRM Backend is working!')
})

module.exports = router