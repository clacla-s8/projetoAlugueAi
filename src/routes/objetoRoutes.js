const express = require('express');
const objetoController = require('../controller/objetoController');
const router = express.Router();
const authMiddleware = require('../middlewares/autenticacao');

router.use(authMiddleware);

router.get('/', objetoController.obterTodos);
router.get('/:nome', objetoController.obterPorNome);
//router.get('/:id', objetoController.obterPorId);

router.post('/cadastrar/:id', objetoController.salvarObjeto);

router.delete('/:id', objetoController.deletarPorId);


module.exports = router;