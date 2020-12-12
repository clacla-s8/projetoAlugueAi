const express = require('express');
const anuncianteController = require('../controller/anuncianteController');
const router = express.Router();

router.get('/', anuncianteController.obterTodos);

router.post('/cadastrar', anuncianteController.salvarAnunciante);

router.put('/:id', anuncianteController.atualizarAnunciante);

router.delete('/:id', anuncianteController.deletarAnunciante);

module.exports = router;