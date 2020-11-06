const bcrypt = require("bcryptjs");
const { Connection } = require('../config/MongoConnection');

async function create(user) {
   if (!user.hasOwnProperty("username") || !user.hasOwnProperty("email") || !user.hasOwnProperty("password"))
      throw "Campos faltantes";
   user.password = await encriptarPassword(user.password);
   console.log(user);
   const resultado = await Connection.db.db("apifoxes").collection("users").insertOne(user);
   return resultado;
}

async function getByEmail(email) {
   const resultado = await Connection.db.db("apifoxes").collection("users").findOne({ email: email });
   return resultado;
}

async function encriptarPassword(password) {
   const salt = await bcrypt.genSalt(10);
   return bcrypt.hash(password, salt);
}

async function validarPasswordBcrypt(email, password) {
   userDB = await getByEmail(email);
   return await bcrypt.compare(password, userDB.password);
}

module.exports = { create, getByEmail, validarPasswordBcrypt };
