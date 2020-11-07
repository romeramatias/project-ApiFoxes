require('dotenv').config()
const timestamp = require('time-stamp');

function now() {
    return timestamp('[YYYY/MM/DD HH:mm:ss]')
}

module.exports = { now, secret: process.env.SECRET };
