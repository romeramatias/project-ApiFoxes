const cron = require("node-cron");
const matchesController = require("../controller/Matches");

cron.schedule("0 0 0 * * *", () => {
   console.log("Ejecutando funcion cron.");
   matchesController.cron();
});

module.exports = cron;
