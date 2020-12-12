const express = require('express');
const clienteController = require('../controller/clienteController');
const router = express.Router();

router.get('/', clienteController.obterTodos);

router.post('/cadastrar', clienteController.salvarCliente);

router.put('/:id', clienteController.atualizarCliente);

router.delete('/:id', clienteController.deletarCliente);

module.exports = router;