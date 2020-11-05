const express = require("express");
const router = express.Router();
const matchesController = require("../controller/Matches");
const moment = require("moment"); // require

// GET Todos los partidos
router.get("/", async (req, res) => {
   const data = await matchesController.getAll();
   res.json(data);
});

// GET Ultimo partido
router.get("/last", async (req, res) => {
   const last = await matchesController.last()
   if (last != null) {
      res.json(last[0]);
   } else {
      res.status(404).send(`No se ha encontrado el ultimo partido`);
   }
});

// GET Un partido por id
router.get("/id/:id", async (req, res) => {
   const match = await matchesController.getById(req.params.id);
   if (match != null) {
      res.json(match);
   } else {
      res.status(404).send(`No se ha encontrado el partido con id ${req.params.id}`);
   }
});

// GET Un partido por fecha
// Esquema:
// http://localhost:3000/matches/date/2020-11-2
router.get("/date/:date", async (req, res) => {
   const match = await matchesController.getByDate(req.params.date);
   if (match != null) {
      res.json(match);
   } else {
      res.status(404).send(`No se ha encontrado el partido con fecha de ${req.params.date}`);
   }
});

// GET Partidos por intervalo de fechas
// http://localhost:3000/matches/2020-09-01/2020-11-05
router.get("/:date1/:date2", async (req, res) => {
   const date1 = req.params.date1;
   const date2 = req.params.date2;
   const matches = await matchesController.getByDateRange(date1, date2);
   
   if (matches != null && matches.length > 0) {
      res.json(matches);
   } else {
      res.status(404).send(`No se han encontrado partidos entre ${date1} y ${date2}`);
   }
});

// GET para obtener los puntos que tiene Leicester por un rango de fechas
router.get("/points/:date1/:date2", async (req, res) => {
   const date1 = req.params.date1;
   const date2 = req.params.date2;
   const matches = await matchesController.getByDateRange(date1, date2);

   let points = 0;
   matches.forEach((match) => {
      points += match.points;
   });

   if (matches != null && matches.length > 0) {
      if (points > 0) {
         res.json({ message: `Los Foxes hicieron ${points} puntos entre ${date1} y ${date2}` });
      } else {
         res.json({ message: `Los Foxes no hicieron ningun punto entre ${date1} y ${date2}` });
      }
   } else {
      res.status(404).send(`No se han encontrado partidos entre ${date1} y ${date2}`);
   }
});

// GET Del equipo que mas goles le hizo a Leicester
router.get("/mostGA", async (req, res) => {
   const partido = await matchesController.mostGA();

   if (partido != null) {
      res.json({ message: `El equipo que mas goles le hizo a Leicester fue ${partido.rival} con ${partido.ga} goles` });
   } else {
      res.status(404).send(`No se han encontrado los partidos`);
   }
});

// POST Agregar un partido
// TODO Validaciones
router.post("/addMatch", async (req, res) => {
   const match = req.body;
   try {
      const result = await matchesController.addMatch(match);
      if (result.insertedCount == 1) {
         res.status(201).send("El partido fue agregado exitosamente");
      } else {
         res.status(500).send("Se produjo un error al intentar agregar el partido");
      }
   } catch (error) {
      res.status(500).send(error);
   }
});

module.exports = router;
