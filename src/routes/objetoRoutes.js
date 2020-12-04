const express = require('express');
const objetoController = require('../controller/objetoController');
const router = express.Router();

router.get('/', objetoController.obterTodos);
router.get('/:nome', objetoController.obterPorNome);

router.post('/cadastrar', objetoController.salvarObjeto);



module.exports = router;