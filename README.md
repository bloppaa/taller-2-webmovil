# Web Movil - Taller 2

## Grupo Mish - Integrantes
- Pablo Cortés 20.600.436-3
- Renata Cuello 20.949.079-K
- Diego Castro 18.633.660-7
- Fabricha Ramírez 20.990.386-5

## Tecnologías utilizadas

- API Pokémon con [PokeAPI](https://pokeapi.co/) y [Express.js](https://expressjs.com/).
- API Recetas con [Spoonacular](https://spoonacular.com/food-api) y [NestJS](https://nestjs.com/).
- API Videojuegos con [RAWG](https://api.rawg.io/docs/) y [FastAPI](https://fastapi.tiangolo.com/).
- Bases de datos con [SQLite](https://sqlite.org/).
- Despliegue de servicios en [Render](https://render.com/).
- Monitoreo con [UptimeRobot](https://uptimerobot.com/).

Información de APIs públicas en este enlace: https://github.com/public-apis/public-apis.

Para las bases de datos se usó [SQLite](https://sqlite.org/) por su facilidad de uso. No hay necesidad de configurar nada. Debido a la simplicidad de las queries se prefirió usar queries parametrizadas en vez de ocupar un ORM.

## Instalación y ejecución

Las 3 APIs están desplegadas en [Render](https://render.com/), por lo que hay necesidad de descargar ni configurar nada. Solo se debe descargar la APK y empezar a usar. Con una cuenta gratuita de Render los servicios se duermen después de 15 minutos de inactividad, por lo que será necesario esperar a que los servicios despierten. Se recomienda que al iniciar la aplicación, se abran las 3 APIs para despertarlas y esperar aproximadamente 1 minuto para que se puedan usar.

## Documentación

La documentación de cada API se escribió con [Swagger](https://swagger.io/).

- API Pokémon: https://taller-2-webmovil-express.onrender.com/docs
- API Recetas: https://taller-2-webmovil-nestjs.onrender.com/docs
- API Videojeugos: https://taller-2-webmovil.onrender.com/docs
