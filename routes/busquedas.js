const { Router } = require('express');

const { buscar } = require('../controllers/busquedas');

const router = Router();


//Las búsquedas pueden ser por GET, POST, PUT, DELETE ...
//pero se acostumbra que sean por GET
//y los parámetros de búsqueda se mandan en la url
//Ejm: {{url}}/apii/busquedas/productos/oreo
router.get('/:coleccion/:termino', buscar )


module.exports = router;