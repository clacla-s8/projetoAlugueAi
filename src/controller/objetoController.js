const { req, res } = require('express');
const mongoose = require('mongoose');
const Objeto = require('../model/Objeto');
const Usuario = require('../model/Usuario');

const obterTodos = async(req, res, next) => {
    Objeto.find()
        .then((objetos) => {
            if (objetos == 0) {
                res.status(404).json({ mensagem: 'Não há objetos cadastrados' });
            }
            res.status(200).json(objetos);
        })
        .catch(err => next(err))
}

const obterPorNome = async(req, res, next) => {
    const { nome } = req.params;
    console.log(nome)
    Objeto.find({ nome: nome })
        .then(async existeObjeto => {
            if (existeObjeto == 0) {
                res.status(404).json({ mensagem: 'Este objeto não esta cadastrado' });
            }
            res.status(200).json(existeObjeto);

        })
        .catch(err => next(err));

}


const salvarObjeto = async(req, res, next) => {
    //usuario = req.params;
    //id = usuario.id;
    const { nome, preco, foto, categoria } = req.body;
    try {
        const novoObjeto = await Objeto.create({
            nome,
            preco,
            foto,
            categoria
            //UsuarioId: req.userId

        });


        await novoObjeto.save()
            .then((objeto) => {
                res.status(201).json(objeto);
            })
            .catch(err => next(err));



        //const usuarioPorId = await Usuario.findById(req.userId)
        //usuarioPorId.objetos.push(novoObjeto)
        // await usuarioPorId.save()

    } catch (e) {
        return res.status(400).json(e)
    }
}

const atualizarObjeto = async(req, res, next) => {
    const { id } = req.params;

    Objeto.findById(id)
        .then((objeto) => {
            if (objeto.isAlugado == true) {
                return res.status(400).json({ mensagem: 'Não é possivel atualizar objetos alugados' })
            }

            Objeto.findByIdAndUpdate(id, req.body)
                .then(() => {
                    res.status(200).json({ mensagem: ' O objeto foi atualizado.' });
                })
                .catch(err => next(err));
        })
        .catch(e => res.status(500).json(e));
}


const deletarPorId = async(req, res, next) => {
    const { id } = req.params;
    Objeto.findById(id)
        .then(async(objeto) => {
            if (objeto.isAlugado == true) {
                return res.status(400).json({ mensagem: 'Não é possivel remover objetos alugados' })
            }
            await Usuario.findOneAndUpdate({ _id: objeto.usuarioId }, { $pull: { objetos: id } })
            Objeto.findByIdAndRemove(id)
                .then(() => {
                    res.status(200).json({ mensagem: 'Objeto removido !' })
                })
                .catch((err) => {
                    res.status(400).json(err, { mensagem: 'Não foi possivel remover' })
                })
        })
        .catch(err => next(err))
}


module.exports = {
    obterTodos,
    obterPorNome,
    salvarObjeto,
    atualizarObjeto,
    deletarPorId
}