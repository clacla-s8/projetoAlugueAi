const express = require("express")
const router = express.Router()
const controller = require("../controller/sessaoController")
const sessaoClienteController = require('../controller/sessaoControllerCliente');

router.post('/anunciante', controller.accessTokenAnunciante);
router.post('/cliente', sessaoClienteController.accessTokenCliente);

module.exports = router;