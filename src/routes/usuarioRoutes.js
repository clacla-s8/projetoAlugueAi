const express = require('express');
const usuarioController = require('../controller/usuarioController');
const router = express.Router();

router.post('/cadastrar', usuarioController.salvarUsuario);

router.get('/', usuarioController.obterTodos);
router.get('/usuario', usuarioController.obterUsuario);

router.put('/atualizar', usuarioController.atualizarUsuario);

router.delete('/:id', usuarioController.deletarUsuario);

module.exports = router;