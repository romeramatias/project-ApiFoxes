require('dotenv').config()
const timestamp = require('time-stamp');

function now() {
    return timestamp.utc('[YYYY/MM/DD HH:mm:ss]')
}

module.exports = { now, secret: process.env.SECRET };
