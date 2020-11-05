const express = require("express");
const router = express.Router();
const userRepository = require("../controller/User");
const jwt = require("jsonwebtoken");
const config = require("../config");

router.post("/login", async (req, res, next) => {
   const { email, password } = req.body;
   const user = await userRepository.getByEmail(email);

   if (!user) {
      return res.status(404).send(`No existe usuario con mail: ${email}`);
   }
   const passValida = await userRepository.validarPasswordBcrypt(email, password);

   if (!passValida) {
      return res.status(404).send(`Contraseña incorrecta`);
   }
   const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: "1d" });
   res.json({ autorizacion: true, token: token, mensaje: "Sesión inciada, utilizar Bearer Token" });
});

router.post("/signup", async (req, res, next) => {
   const {email} = req.body;
   const userEnBase = await userRepository.getByEmail(email);
   const user = req.body;

   if(userEnBase!=null){
      res.status(400).send("Este usuario ya existe");
   } else {
      try {
         await userRepository.create(user);
         res.json({ autorizacion: true, mensaje: "Usuario registrado, inicie sesion para obtener un token" });
      } catch (error) {
         res.status(500).send(error);
      }
   }
  
});



module.exports = router;
