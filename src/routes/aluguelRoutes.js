const express = require('express');
const aluguelController = require('../controller/aluguelController');
const router = express.Router();

router.get('/', aluguelController.obterAlugueis);

router.post('/alugar', aluguelController.alugar);

router.delete('/devolver/:id', aluguelController.devolver);

module.exports = router;