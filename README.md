# API-Foxes

**TO-DO**
- Cron
- Post Validates

---

API Rest de los resultados de **Leicester City FC**, en donde se podran visualizar datos de los ultimos partidos de los Foxes. Realizada con **Node.js**, **MongoDB Atlas**, alojada en **Heroku**.

Librerias utilizadas:
- Express
- Axios
- JSONWebToken
- Dotenv
- Bcryptjs


# Endpoints

A continuacion intentare explicar en detalle el funcionamiento de cada una de las rutas, parametros que requieren y demas detalles. En el repositorio se encuentran ejemplos de request implementados en **Postman** para probar cada una de las rutas.
> URL Heroku -> [API-Foxes](https://aqueous-cliffs-76671.herokuapp.com)
> Postman Request's -> [Postman Request's](https://github.com/romeramatias/project-ApiFoxes/blob/master/API-Foxes.postman_collection.json)

## Users

Rutas de **registro** y **login** de **usuarios** necesarias para visualizar datos de los partidos

---
### Sign Up
>Ruta -> https://aqueous-cliffs-76671.herokuapp.com/users/signup

Ruta de registro de usuarios. Se debera enviar por  el **Body** un **JSON** con el siguiente esquema:
>{
	"username": "tunombredeusuario",
	"email": "tuemail@gmail.com",
    "password": "tupassword"
>}

En el caso de que el registro sea exitoso se te pedira que realices el **login** para obtener un **token**.

---
### Login
> Ruta -> https://aqueous-cliffs-76671.herokuapp.com/users/login

Para logearse en la API deberan enviar su **email** y **password** previamente ingresadas en el registro. El esquema será el siguiente:
>{
"email": "tuemail@gmail.com",
"password": "tupassword"
}

En el caso de que el ingreso sea exitoso se te brindara un **token** para que puedas acceder a las rutas de partidos.

---

## Matches

Aqui se encuentran las rutas con informacion sobre el equipo y sus partidos. 

Para poder visualizar la informacion habra que ingresar un **Bearer Token** previamente obtenido en el login de usuario.

Si se utiliza Postman, el procedimiento para ingresar el **token** es el siguiente:
- Click en la solapa **Authorization**
- En **Type** seleccionaremos **Bearer Token**
- A la derecha, en el campo **Token** ingresaremos el token provisto
---
### All Matches

> Ruta -> https://aqueous-cliffs-76671.herokuapp.com/users/login

En esta ruta obtendremos **todos los partidos** del Leicester ingresados en la base de datos de MongoDB **ordenados en fecha descendente**

---
### Last Match

> Ruta -> https://aqueous-cliffs-76671.herokuapp.com/matches/last

Ruta que nos brinda cual fue el **ultimo partido** disputado del equipo

---
### Match by ID

> Ruta -> https://aqueous-cliffs-76671.herokuapp.com/matches/id/ + **ID**

Busqueda de un partido por identificador, a la ruta se le debera agregar el parametro de **ID** de tipo numerico para obtener uno de los encuentros.

> **ID** = Number
> **Ejemplo:** 58959
> https://aqueous-cliffs-76671.herokuapp.com/matches/id/58959

---
### Match by Date

> Ruta -> https://aqueous-cliffs-76671.herokuapp.com/matches/date/ + **Date**

Busqueda de un partido por fecha, a la ruta se le debera agregar el parametro de **Fecha** bajo el siguiente esquema:

> **Date** = "AÑO-MES-DIA"
> **Ejemplo:** URL + 2020-11-02
> https://aqueous-cliffs-76671.herokuapp.com/matches/date/2020-11-02

En caso de encontrar un partido con la fecha indicada lo mostrara.

---
### Matches by Dates

> Ruta -> https://aqueous-cliffs-76671.herokuapp.com/matches/ + **Date1** / **Date2**

Busqueda de partidos por un rango de fechas, a la ruta se le deberan agregar dos parametros de **Fechas** bajo el siguiente esquema:

> **Date** = "AÑO-MES-DIA"
> **Ejemplo:** URL + 2020-09-01/2020-09-15
> https://aqueous-cliffs-76671.herokuapp.com/matches/2020-09-01/2020-09-15

En caso de encontrar partidos en el rango indicado los mostrara.

---
### Points by Dates

> Ruta -> https://aqueous-cliffs-76671.herokuapp.com/matches/points/ + **Date1** / **Date2**

Devolvera los puntos obtenidos dentro de un rango de fechas, a la ruta se le deberan agregar dos parametros de **Fechas** siguiendo los esquemas anteriores:

> **Date** = "AÑO-MES-DIA"
> **Ejemplo:** URL + 2020-09-01/2020-09-05
> https://aqueous-cliffs-76671.herokuapp.com/matches/points/2020-09-01/2020-11-05

Mostrara la cantidad de puntos del Leicester en el rango indicado.

---
### Rival Most Goals

> Ruta -> https://aqueous-cliffs-76671.herokuapp.com/matches/mostGA

No se le deberan enviar parametros. Devolvera el **rival que mas goles le marco al Leicester**.
