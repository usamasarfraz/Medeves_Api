const express = require('express');
const router = express.Router();

router.post('/',(req,res) => {
    res.send('Test User Route');
})

module.exports = router;