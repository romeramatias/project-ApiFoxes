const express = require("express");
const router = express.Router();
const dataMatches = require("../controller/Matches");

/* GET home page. */
router.get("/", function (req, res, next) {
   dataMatches.cron();
   res.render("index", { title: "Express" });
});

module.exports = router;
