const { req, res } = require('express');
const mongoose = require('mongoose');
const Objeto = require('../model/Objeto');
const Anunciante = require('../model/Anunciante');

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

const obterPorId = async(req, res) => {
    const { id } = req.params;
    Objeto.findById(id)
        .then((objeto) => {
            if (objeto == 0) {
                res.status(404).json({ message: 'Não há objetos cadastrados' });
            }
            res.status(200).json(objeto);
        })
        .catch((err) => {
            res.status(400).json(err);
        })
}

const obterPorNome = async(req, res) => {
    const { nome } = req.params;
    console.log(nome)
    Objeto.find({ nome: nome })
        .then(async existeObjeto => {
            if (existeObjeto == 0) {
                res.status(404).json({ message: 'Este objeto não esta cadastrado' });
            }
            res.status(200).json(existeObjeto);

        })
        .catch((err) => {
            res.status(400).json(err);
        });

}


const salvarObjeto = async(req, res, next) => {
    anunciante = req.params;
    id = anunciante.id;
    const { nome, preco, foto } = req.body;
    try {
        const novoObjeto = await Objeto.create({
            nome,
            preco,
            foto,
            anuncianteId: id

        });


        await novoObjeto.save()
            .then((objeto) => {
                res.status(201).json(objeto);
            })
            .catch(err => next(err));



        const anunciantePorId = await Anunciante.findById(id)
        anunciantePorId.objetos.push(novoObjeto)
        await anunciantePorId.save()

    } catch (e) {
        return res.status(400).json(e)
    }
}

const deletarPorId = async(req, res) => {
    const { id } = req.params;
    Objeto.findById(id)
        .then(async(objeto) => {
            if (objeto.isAlugado == true) {
                return res.status(400).json({ message: 'Não é possivel remover objetos alugados' })
            }
            await Anunciante.findOneAndUpdate({ _id: objeto.anuncianteId }, { $pull: { objetos: id } })
            Objeto.findByIdAndRemove(id)
                .then(() => {
                    res.status(200).json({ message: 'Objeto removido !' })
                })
                .catch((err) => {
                    res.status(400).json(err, { message: 'Não foi possivel remover' })
                })
        })
        .catch((e) => {
            res.status(400).json(e)
        })
}


module.exports = {
    obterTodos,
    obterPorNome,
    obterPorId,
    salvarObjeto,
    deletarPorId
}