


# API-Foxes

API Rest de los resultados de **Leicester City FC**, en donde se podrán visualizar datos de los últimos partidos de los Foxes. Realizada con **Node.js**, **MongoDB Atlas**, alojada en **Heroku**.

Librerias utilizadas:
- Express
- Axios
- JSONWebToken
- Dotenv
- Bcryptjs
- Node-Cron
- Chalk
- Time-stamp

![Index](https://github.com/romeramatias/project-ApiFoxes/blob/master/public/image.jpg)

# Actualización de datos

La API está hosteada en **Heroku** y los partidos serán **actualizados todos los días a las 00:00** mediante una función programada, también serán **actualizados** cuando el **servidor** se ejecute de manera **local** o en un llamado al servidor de Heroku cuando la aplicacion este 'idling' (durmiendo).

# Endpoints

A continuación intentaré explicar en detalle el funcionamiento de cada una de las rutas, parámetros que requieren y demás detalles. En el repositorio se encuentran ejemplos de request implementados en **Postman** para probar cada una de las rutas. Incluyo en el proyecto el archivo .env para facilitar la prueba a modo local.

> URL Heroku -> [API-Foxes](https://aqueous-cliffs-76671.herokuapp.com)
>
> Postman Request's -> [Postman Request's](https://github.com/romeramatias/project-ApiFoxes/blob/master/API-Foxes.postman_collection.json)

# Users

Rutas de **registro** y **login** de **usuarios** necesarias para visualizar datos de los partidos

## Sign Up


>Ruta -> https://aqueous-cliffs-76671.herokuapp.com/users/signup

Ruta de registro de usuarios. Se deberá enviar por  el **Body** un **JSON** con el siguiente esquema:
	    
	{
	  "username" : "tunombre"
      "email": "tuemail@gmail.com",
	  "password": "tupassword"
	}

En el caso de que el registro sea exitoso se te pedirá que realices el **login** para obtener un **token**.


## Login
> Ruta -> https://aqueous-cliffs-76671.herokuapp.com/users/login

Para logearse en la API deberan enviar en formato **JSON** su **email** y **password** previamente ingresados en el registro. El esquema será el siguiente:

    {
      "email": "tuemail@gmail.com",
	  "password": "tupassword"
	}

En el caso de que el ingreso sea exitoso se te brindara un **token** para que puedas acceder a las rutas de partidos.

---

# Matches

Aquí se encuentran las rutas con información sobre el equipo y sus partidos. 

Para poder visualizar la información habrá que ingresar un **Bearer Token** previamente obtenido en el login de usuario.

Si se utiliza Postman, el procedimiento para ingresar el **token** es el siguiente:
- Click en la solapa **Authorization**
- En **Type** seleccionaremos **Bearer Token**
- A la derecha, en el campo **Token** ingresaremos el token provisto

## All Matches

> Ruta -> https://aqueous-cliffs-76671.herokuapp.com/matches

En esta ruta obtendremos **todos los partidos** del Leicester ingresados en la base de datos de MongoDB **ordenados en fecha descendente**


## Last Match

> Ruta -> https://aqueous-cliffs-76671.herokuapp.com/matches/last

Ruta que nos brinda cuál fue el **último partido** disputado del equipo

## Match by ID

> Ruta -> https://aqueous-cliffs-76671.herokuapp.com/matches/id/ + **ID**

Búsqueda de un partido por identificador, a la ruta se le deberá agregar el parámetro de **ID** de tipo numérico para obtener uno de los encuentros.

	ID = Number
	Ejemplo: 58959
> Ruta Ejemplo -> https://aqueous-cliffs-76671.herokuapp.com/matches/id/58959


## Match by Date

> Ruta -> https://aqueous-cliffs-76671.herokuapp.com/matches/date/ + **Date**

Búsqueda de un partido por fecha, a la ruta se le deberá agregar el parámetro de **Fecha** bajo el siguiente esquema:

	Date = "AÑO-MES-DIA"
	Ejemplo: 2020-11-02
> Ruta Ejemplo ->  https://aqueous-cliffs-76671.herokuapp.com/matches/date/2020-11-02

En caso de encontrar un partido con la fecha indicada lo mostrara.

## Matches by Dates

> Ruta -> https://aqueous-cliffs-76671.herokuapp.com/matches/ + **Date1** / **Date2**

Búsqueda de partidos por un rango de fechas, a la ruta se le deberán agregar dos parámetros de **Fechas** bajo el siguiente esquema:

	Date = "AÑO-MES-DIA"
	Ejemplo: 2020-09-01/2020-09-15

> Ruta Ejemplo -> https://aqueous-cliffs-76671.herokuapp.com/matches/2020-09-01/2020-09-15

En caso de encontrar partidos en el rango indicado los mostrará.

## Points by Dates

> Ruta -> https://aqueous-cliffs-76671.herokuapp.com/matches/points/ + **Date1** / **Date2**

Devolverá los puntos obtenidos dentro de un rango de fechas, a la ruta se le deberán agregar dos parámetros de **Fechas** siguiendo los esquemas anteriores:

	Date = "AÑO-MES-DIA"
	Ejemplo: 2020-09-01/2020-09-15

>  Ruta Ejemplo -> https://aqueous-cliffs-76671.herokuapp.com/matches/points/2020-09-01/2020-11-05

Mostrará la cantidad de puntos del Leicester en el rango indicado.

## Rival Most Goals

> Ruta -> https://aqueous-cliffs-76671.herokuapp.com/matches/mostGA

No se le deberán enviar parámetros. Devolverá el **rival que más goles le marco al Leicester**.
