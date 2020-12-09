const express = require('express');
const clienteController = require('../controller/clienteController');
const router = express.Router();

router.get('/', clienteController.obterTodos);

router.post('/cadastrar', clienteController.salvarCliente);

module.exports = router;