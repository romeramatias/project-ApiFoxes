require('dotenv').config()
const { MongoClient } = require("mongodb");

const uriMongo = process.env.URIMONGO;

const client = new MongoClient(uriMongo, { useUnifiedTopology: true, useNewUrlParser: true });

async function getConnection() {
   return await client.connect().catch((err) => console.log(err));
}


module.exports = { getConnection };
