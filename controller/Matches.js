const dataExtract = require("../config/data");
const { Connection } = require("../config/MongoConnection");
const config = require("../config");
const chalk = require("chalk");

async function getAll() {
   const matches = await Connection.db.db("apifoxes").collection("matches").find().sort({ date: -1 }).toArray();
   return matches;
}

async function last() {
   const last = await Connection.db.db("apifoxes").collection("matches").find().sort({ date: -1 }).limit(1).toArray();
   return last;
}

async function getById(id) {
   if (typeof id != Number) throw "ID debe ser de tipo numerico"
   const match = await Connection.db
      .db("apifoxes")
      .collection("matches")
      .findOne({ id: parseInt(id) });
   return match;
}

async function getByDate(date) {
   date = dateCreator(date);
   if (date == "Invalid Date") throw "Fecha invalida";
   date.setUTCHours(0, 0, 0);

   const match = await Connection.db.db("apifoxes").collection("matches").findOne({ date: date });
   return match;
}

async function getByDateRange(date1, date2) {
   date1 = dateCreator(date1);
   date2 = dateCreator(date2);

   if (date1 == "Invalid Date" || date2 == "Invalid Date") throw "Rango de fechas invalidos";
   if (datesOutOfRange(date1, date2)) throw "Fuera del rango de fechas validas"

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

function dateCreator(date) {
   return new Date(date);
}

function datesOutOfRange(date1, date2){
   const oldDate = new Date("1970-01-01")
   return ((!(date1 > oldDate && date1 < Date.now()) || !(date2 > oldDate && date2 < Date.now())))
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
            console.log(chalk.black.bgMagenta(config.now(), "Se ha agregado el siguiente partido:"));
            console.log(chalk.black.bgMagenta(config.now(), element));
         } else {
            corte = true;
            console.log(chalk.black.bgMagenta(config.now(), "Ingreso de partidos finalizado."));
         }
         index++;
      }
   } else {
      console.log(chalk.black.bgMagenta(config.now(), "No hay nuevos partidos."));
   }

   /*  
      //Ineficiente al recorrer toda la db para buscar si el partido esta ingresado
      //Pero funcionaria para agregar partidos viejos 
      for (let index = 0; index < matches.length; index++) {
         const element = matches[index];
         const matchInMongo = await getById(element.id);
         if (matchInMongo == null) {
            await create(element);
            console.log(config.now(), "Se ha agregado el siguiente partido:");
            console.log(config.now(), element);
         } else {
            console.log("No inserta");
         }
      } 
   */
}

module.exports = { getAll, getById, create, getByDate, getByDateRange, addMatch, last, mostGA, cron };
