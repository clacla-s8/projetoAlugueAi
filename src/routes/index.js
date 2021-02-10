const express = require('express');
const app = require('../app');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        nome: "API Alugue Aí",
        versao: "1.0",
        descricao: "A Alugue Aí, tem por objetivo conectar pessoas que tenham objetos ociosos em casa e gostariam de coloca-los para alugar à pessoas que têm o interesse em alugar estes objetos",
        Autora: "Clarice Santos"
    })
});

module.exports = router;