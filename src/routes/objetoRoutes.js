const express = require('express');
const objetoController = require('../controller/objetoController');
const router = express.Router();


router.post('/cadastrar', objetoController.salvarObjeto);
router.delete('/:id', objetoController.deletarPorId);
router.put('/atualizar/:id', objetoController.atualizarObjeto);

router.get('/', objetoController.obterTodos);
router.get('/:nome', objetoController.obterPorNome);


module.exports = router;