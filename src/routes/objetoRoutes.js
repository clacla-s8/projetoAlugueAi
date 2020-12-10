const express = require('express');
const objetoController = require('../controller/objetoController');
const router = express.Router();
const authMiddleware = require('../middlewares/autenticacao');
const authMiddlewareCliente = require('../middlewares/autenticacaoCliente');

router.use(authMiddleware);

router.post('/cadastrar/:id', objetoController.salvarObjeto);
router.delete('/:id', objetoController.deletarPorId);
router.put('/atualizar/:id', objetoController.atualizarObjeto);

router.use(authMiddlewareCliente);

router.get('/', objetoController.obterTodos);
router.get('/:nome', objetoController.obterPorNome);
//router.get('/:id', objetoController.obterPorId);




module.exports = router;