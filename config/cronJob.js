const cron = require("node-cron");
const matchesController = require("../controller/Matches");

cron.schedule("0 0 0 * * *", () => {
   console.log("Funcion Cron ejecutada");
   matchesController.cron();
});

module.exports = cron;
