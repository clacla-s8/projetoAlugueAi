const express = require('express');
const router = express.Router();
const controller = require('../controller/sessaoController');

router.post('/usuario', controller.accessTokenUsuario);



module.exports = router;