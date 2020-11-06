const dataExtract = require("../config/data");
const { Connection } = require('../config/MongoConnection');

async function getAll() {
   const matches = await Connection.db.db("apifoxes").collection("matches").find().sort({ date: -1 }).toArray();
   return matches;
}

async function last() {
   const last = await Connection.db.db("apifoxes").collection("matches").find().sort({ date: -1 }).limit(1).toArray();
   return last;
}

async function getById(id) {
   const match = await Connection.db
      .db("apifoxes")
      .collection("matches")
      .findOne({ id: parseInt(id) });
   return match;
}

async function getByDate(date) {
   date = dateCreator(date);
   date.setUTCHours(0, 0, 0);

   const match = await Connection.db.db("apifoxes").collection("matches").findOne({ date: date });
   return match;
}

async function getByDateRange(date1, date2) {
   date1 = dateCreator(date1);
   date2 = dateCreator(date2);
   const matches = await Connection.db
      .db("apifoxes")
      .collection("matches")
      .find({ $and: [{ date: { $gte: date1 } }, { date: { $lte: date2 } }] })
      .sort({ date: -1 })
      .toArray();
   return matches;
}

async function create(match) {
   const resultado = await Connection.db.db("apifoxes").collection("matches").insertOne(match);
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
   const resultado = await Connection.db.db("apifoxes").collection("matches").insertOne(match);
   return resultado;
}

// Suponiendo que la db esta al dia y no hay partidos mas antiguos al ultimo para ingresar
// Corta la ejecucion al encontrar un partido ya ingresado
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
            await create(element);
            console.log("Se ha agregado el siguiente partido:");
            console.log(element);
         } else {
            corte = true;
            console.log("Ingreso de partidos finalizado.");
         }
         index++;
      }
   } else {
      console.log("No hay nuevos partidos.");
   }

 /*  
      //Ineficiente al recorrer toda la db para buscar si el partido esta ingresado
      //Pero funcionaria para agregar partidos viejos 
      for (let index = 0; index < matches.length; index++) {
         const element = matches[index];
         const matchInMongo = await getById(element.id);
         if (matchInMongo == null) {
            await create(element);
            console.log("Se ha agregado el siguiente partido:");
            console.log(element);
         } else {
            console.log("No inserta");
         }
      } 
   */
}

module.exports = { getAll, getById, create, getByDate, getByDateRange, addMatch, last, mostGA, cron };
