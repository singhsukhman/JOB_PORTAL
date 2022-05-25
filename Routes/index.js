const express = require('express');
const router = express.Router();
module.exports = {
    orgRoute :router.use('/org', require('./orgRoute')),
    userRoute :router.use('/user', require('./userRoute')),
    // jobRoute : router.use('/job', require('./jobRoute'))
}

