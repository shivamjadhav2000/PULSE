const express = require('express')
const router = express.Router()

router.use('/api', require('./api'))
router.get('/', (req, res) => {
    console.log('Pulse Backend is working!')
    console.log('req',req.headers)
    res.send('Pulse Backend is working!')
})

module.exports = router