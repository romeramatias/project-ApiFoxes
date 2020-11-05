const axios = require("axios");
// Data reducida a 50 partidos
const urlAPI =
   "https://footballapi-lcfc.pulselive.com/football/fixtures?teams=26&comps=1,4,5,2,210,3&compSeasons=&homeTeams=&page=0&pageSize=20&sort=desc&statuses=C&altIds=true&provisional=false&detail=2";

// Funcion que trae todos los partidos con todos sus datos
async function getDatos() {
   try {
      let res = await axios(urlAPI);
      return res.data;
   } catch (error) {
      console.log("ERROR GET HTTP", error);
   }
}

// Verifica que tipo de resultado fue el partido ('WIN', 'DRAW', 'LOSE')
// Verifica los puntos que obtuvo
// Setea los goles en contra
// Setea nombre del equipo rival
function verifyWinner(match) {
   if (match.home === "Leicester City") {
      match.ga = match.scoreAway;
      match.rival = match.away;
      if (match.scoreHome > match.scoreAway) {
         match.result = "Win";
         match.points = 3;
      } else if (match.scoreHome === match.scoreAway) {
         match.result = "Draw";
         match.points = 1;
      }
   } else {
      match.ga = match.scoreHome;
      match.rival = match.home;
      if (match.scoreHome < match.scoreAway) {
         match.result = "Win";
         match.points = 3;
      } else if (match.scoreHome === match.scoreAway) {
         match.result = "Draw";
         match.points = 1;
      }
   }
}

// Extraccion de los datos necesarios
async function dataExtractor() {
   let data = await getDatos();
   let matches = [];
   for (let index = 0; index < data.content.length; index++) {
      const element = data.content[index];
      matches.push({
         id: element.id,
         home: element.teams[0].team.name,
         away: element.teams[1].team.name,
         scoreHome: element.teams[0].score,
         scoreAway: element.teams[1].score,
         date: new Date(element.kickoff.label.replace("BST", "GMT")),
         competition: element.gameweek.compSeason.competition.description,
         stadium: element.ground.name,
         result: "Lose",
         points: 0,
         ga: 0,
         rival: "",
      });
      verifyWinner(matches[index]);
      matches[index].date.setUTCHours(0, 0, 0, 0);
   }
   return matches;
}

module.exports = { dataExtractor };
