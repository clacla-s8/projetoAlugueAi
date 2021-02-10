const { req, res } = require('express');
const mongoose = require('mongoose');
const Usuario = require('../model/Usuario');
const Objeto = require('../model/Objeto');
const Aluguel = require('../model/Aluguel');

const obterAlugueis = async(req, res) => {
    Aluguel.find()
        .then((alugueis) => {
            if (alugueis == 0) {
                res.status(404).json({ mensagem: 'Não há aluguel' });
            }
            res.status(200).json(alugueis);
        })
        .catch((err) => {
            res.status(500).json(err);
        });

}

const alugar = async(req, res) => {
    let { idObjeto } = req.body;
    let { IdUsuario } = req.body;

    Objeto.findById(idObjeto).then(objetoEncontrado => {
        if (objetoEncontrado.isAlugado == true) {
            return res.status(400).json({ mensagem: 'Objeto ja esta alugado' })
        }
        Usuario.findById(IdUsuario).then(usuario => {
            usuario.objetosAlugados.push(objetoEncontrado._id)
            usuario.save().then(() => {
                objetoEncontrado.isAlugado = true;
                objetoEncontrado.save().then(() => {
                    objetoAlugado = {
                        objetoId: objetoEncontrado._id,
                        usuarioId: IdUsuario,
                    }

                    Aluguel.create(objetoAlugado).then(() => {
                        res.status(200).json({ mensagem: 'Sucesso' })
                    })

                })
            })
        })
    })
}

const devolver = async(req, res) => {
    let { id } = req.params;
    Aluguel.findById(id)
        .then(async(aluguel) => {
            await Objeto.findOneAndUpdate({ _id: aluguel.objetoId }, { $set: { isAlugado: false } })

            await Usuario.findOneAndUpdate({ _id: aluguel.usuarioId }, { $pull: { objetosAlugados: aluguel.objetoId } })

            Aluguel.findByIdAndRemove(id)
                .then(() => {
                    res.status(200).json({ mensagem: 'Devolução realizada' })
                })
                .catch((err) => {
                    res.status(400).json(err, { mensagem: 'Não foi possivel realizar a devolução' })
                })
        })
        .catch((e) => {
            res.status(500).json(e)
        })

}

module.exports = {
    obterAlugueis,
    alugar,
    devolver
}