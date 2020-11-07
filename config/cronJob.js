const cron = require("node-cron");
const matchesController = require("../controller/Matches");
const config = require("../config");
const chalk = require('chalk');

cron.schedule("0 0 0 * * *", () => {
   console.log(chalk.black.bgCyan(config.now(), "Ejecutando funcion cron programada 00:00HS."));
   matchesController.cron();
});

module.exports = cron;
