const connection = require("../config/dbconnection");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcryptjs");

async function create(user) {
   const connectionMongo = await connection.getConnection();
   console.log(user);
   if (!user.hasOwnProperty("username") || !user.hasOwnProperty("email") || !user.hasOwnProperty("password"))
      throw "Campos faltantes";
   user.password = await encriptarPassword(user.password);
   console.log(user);
   const resultado = await connectionMongo.db("apifoxes").collection("users").insertOne(user);
   return resultado;
}

async function getById(id) {
   const connectionMongo = await connection.getConnection();
   id = new ObjectId(id);
   const resultado = await connectionMongo.db("apifoxes").collection("users").findOne({ _id: id });
   return resultado;
}

async function getByEmail(email) {
   const connectionMongo = await connection.getConnection();
   const resultado = await connectionMongo.db("apifoxes").collection("users").findOne({ email: email });
   return resultado;
}

async function encriptarPassword(password) {
   const salt = await bcrypt.genSalt(10);
   return bcrypt.hash(password, salt);
}

async function validarPasswordBcrypt(email, password) {
   userDB = await getByEmail(email);
   console.log(password);
   return await bcrypt.compare(password, userDB.password);
}

module.exports = { create, getById, getByEmail, validarPasswordBcrypt };
