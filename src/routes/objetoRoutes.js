const express = require('express');
const { req, res } = require('express');
const mongoose = require('mongoose');
const Objeto = require('../model/Objeto');
const Usuario = require('../model/Usuario');
const objetoController = require('../controller/objetoController');
const router = express.Router();
const multer = require('multer');
const path = require('path');


var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

var upload = multer({ storage: storage })


router.post('/cadastrar', upload.single("img"), async(req, res, next) => {
    const { nome, preco, categoria } = req.body;
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next("hey error")
    }
    try {
        const novoObjeto = await Objeto.create({
            nome,
            preco,
            img: file.path,
            categoria

        });

        await novoObjeto.save()
            .then((objeto) => {
                res.status(201).json({ success: true, msg: 'cadastro realizado  !' });
            })
            .catch(err => next(err));

    } catch (e) {
        return res.status(400).json(e)
    }
});

router.delete('/:id', objetoController.deletarPorId);
router.put('/atualizar/:id', objetoController.atualizarObjeto);

router.get('/', objetoController.obterTodos);
router.get('/filtrar', objetoController.obterPorNome);



module.exports = router;