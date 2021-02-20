const express = require('express');
const { req, res } = require('express');
const mongoose = require('mongoose');
const Objeto = require('../model/Objeto');
const Usuario = require('../model/Usuario');
const objetoController = require('../controller/objetoController');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 6,
    },
    fileFilter: fileFilter


});

router.route("/cadastrar/image").patch(upload.single("img"), async(req, res) => {
    await Objeto.findOneAndUpdate({ nome: req.nome }, {
            $set: {
                img: req.file.path,
            },
        }, { new: true },
        (err, novoObjeto) => {
            if (err) return res.status(500).send(err);
            const response = {
                msg: "imagem add",
                data: novoObjeto,
            };
            return res.status(200).send(response);

        }
    );
});


router.route('/cadastrar').post(async(req, res, next) => {
    const { nome, preco, img, categoria } = req.body;
    try {
        const novoObjeto = await Objeto.create({
            nome,
            preco,
            img,
            categoria

        });

        await novoObjeto.save()
            .then((objeto) => {
                res.status(201).json({ success: true, msg: 'cadastro realizado !' });
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