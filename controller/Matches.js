const connection = require("../config/dbconnection");
const dataExtract = require("../config/data");

async function getAll() {
   const connectionMongo = await connection.getConnection();
   const matches = await connectionMongo.db("apifoxes").collection("matches").find().sort({ date: -1 }).toArray();
   return matches;
}

async function last() {
   const connectionMongo = await connection.getConnection();
   const last = await connectionMongo.db("apifoxes").collection("matches").find().sort({ date: -1 }).limit(1).toArray();
   return last;
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
   date.setUTCHours(0, 0, 0);
   console.log("dps del set");
   console.log(date);

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
      .sort({ date: -1 })
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

async function mostGA() {
   const data = await getAll();
   let partido = {};
   let ga = 0;
   data.forEach((match) => {
      if (match.ga > ga) {
         partido = { rival: match.rival, ga: match.ga };
         ga = match.ga;
      }
   });
   return partido;
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

async function cron() {
   const matches = await dataExtract.dataExtractor();
   const ultimo = await last();

   let index = 0;
   let corte = false;

   if (!(matches[0].id === ultimo[0].id)) {
      while (!corte && matches.length > index) {
         const element = matches[index];
         const matchInMongo = await getById(element.id);
         if (matchInMongo == null) {
            console.log("Se ha agregado el siguiente partido:");
            console.log(element);
            await create(element);
         } else {
            corte = true;
         }
         index++;
      }
   } else {
      console.log("No hay nuevos partidos");
   }
}

module.exports = { getAll, getById, create, getByDate, getByDateRange, addMatch, last, mostGA, cron };
