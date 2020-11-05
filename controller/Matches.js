const fs = require("fs").promises;
const connection = require("../config/dbconnection");
const dataExtract = require("../config/data");

// TODO FUNCION DEL CRON?
// TODO validar que no se ingrese de nuevo los mismo partidos
async function init() {
   let matches = await dataExtract.dataExtractor();
   for (let index = 0; index < matches.length; index++) {
      const element = matches[index];
      await create(element);
      let elementoEnMongo = await getById(element.id);
      console.log(elementoEnMongo);
   }
}

async function getAll() {
   const connectionMongo = await connection.getConnection();
   const matches = await connectionMongo.db("apifoxes").collection("matches").find().toArray();
   return matches;
}

async function getById(id) {
   const connectionMongo = await connection.getConnection();
   const match = await connectionMongo
      .db("apifoxes")
      .collection("matches")
      .findOne({ id: parseInt(id) });
   return match;
}

async function getByDate(date) {
   const connectionMongo = await connection.getConnection();
   date = dateCreator(date);
   console.log(date);
   date.setHours(0, 0, 0, 0);
   const match = await connectionMongo.db("apifoxes").collection("matches").findOne({ date: date });
   return match;
}

async function getByDateRange(date1, date2) {
   const connectionMongo = await connection.getConnection();
   date1 = dateCreator(date1);
   date2 = dateCreator(date2);
   const matches = await connectionMongo
      .db("apifoxes")
      .collection("matches")
      .find({ $and: [{ date: { $gte: date1 } }, { date: { $lte: date2 } }] })
      .toArray();
   return matches;
}

async function create(match) {
   const connectionMongo = await connection.getConnection();
   const resultado = await connectionMongo.db("apifoxes").collection("matches").insertOne(match);
   return resultado;
}

function dateCreator(date) {
   return new Date(date);
}

// TODO Validar en serio
async function addMatch(match) {
   const connectionMongo = await connection.getConnection();
   console.log(match);
   if (
      !match.hasOwnProperty("id") ||
      !match.hasOwnProperty("home") ||
      !match.hasOwnProperty("away") ||
      !match.hasOwnProperty("scoreHome") ||
      !match.hasOwnProperty("scoreAway") ||
      !match.hasOwnProperty("date") ||
      !match.hasOwnProperty("competition") ||
      !match.hasOwnProperty("stadium") ||
      !match.hasOwnProperty("result") ||
      !match.hasOwnProperty("points") ||
      !match.hasOwnProperty("ga") ||
      !match.hasOwnProperty("rival")
   )
      throw "Campos faltantes";
   console.log(match);
   const resultado = await connectionMongo.db("apifoxes").collection("matches").insertOne(match);
   return resultado;
}

module.exports = { init, getAll, getById, create, getByDate, getByDateRange, addMatch };
