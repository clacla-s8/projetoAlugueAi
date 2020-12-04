const { req, res } = require('express');
const mongoose = require('mongoose');
const Objeto = require('../model/Objeto');

const obterTodos = async(req, res) => {
    Objeto.find()
        .then((objetos) => {
            if (objetos == 0) {
                res.status(404).json({ message: 'Não há objetos cadastrados' });
            }
            res.status(200).json(objetos);
        })
        .catch((err) => {
            res.status(400).json(err);
        })
}

const obterPorNome = async(req, res) => {
    const { nome } = req.params;
    Objeto.find({ nome: nome })
        .then(async existeObjeto => {
            if (existeObjeto) {
                res.status(200).json(existeObjeto);
            } else {
                res.status(404).json({ message: 'Este objeto não esta cadastrado' });
            }
        })
        .catch((err) => {
            res.status(400).json(err);
        });

}


const salvarObjeto = async(req, res, next) => {
    const { nome, preco, foto } = req.body;

    try {
        const novoObjeto = new Objeto({
            nome,
            preco,
            foto,
            anuncianteId: novoObjeto.anuncianteId

        });

        novoObjeto.save()
            .then((objeto) => {
                res.status(201).json(objeto);
            })
            .catch(err => next(err));
    } catch (e) {
        return res.status(400).json(e)
    }
}


module.exports = {
    obterTodos,
    obterPorNome,
    salvarObjeto,
}