const { req, res } = require('express');
const mongoose = require('mongoose');
const { signupUsuarioSchema } = require('../validators/usuario');
const Usuario = require('../model/Usuario');
const Objeto = require('../model/Objeto');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;


exports.obterTodos = async(req, res) => {
    Usuario.find()
        .then((existeUsuario) => {
            if (existeUsuario) {
                res.status(200).json(existeUsuario)
            }
        })
        .catch((e) => {
            res.status(500).json(e)
        })
}
exports.obterUsuario = async(req, res) => {

    Usuario.findOne({ _id: req.userId })
        .then((existeUsuario) => {
            if (existeUsuario) {
                res.status(200).json(existeUsuario)
            }
        })
        .catch((e) => {
            res.status(500).json(e)
        })
}

exports.atualizarUsuario = async(req, res, next) => {
    //const { id } = req.params;
    console.log(req.userId);
    Usuario.findByIdAndUpdate(req.userId, req.body)
        .then(() => {
            res.status(200).json({ success: true, msg: "Perfil atualizado." });
        })
        .catch(err => next(err));

}


exports.salvarUsuario = async(req, res, next) => {
    const { nome, telefone, endereco, email, senha } = req.body;
    const salt = bcrypt.genSaltSync(bcryptSalt);

    try {
        const validacaoUsuario = await signupUsuarioSchema.validate(req.body);

        const usuario = new Usuario(validacaoUsuario);

        Usuario.findOne({ email: validacaoUsuario.email })
            .then(async existeUsuario => {
                if (existeUsuario) {
                    res.status(400).json({ success: false, msg: 'Já existe uma conta com esse email' })
                }

                const senhaEncriptada = await bcrypt.hashSync(senha, salt);
                usuario.senha = senhaEncriptada;
                usuario.save()
                    .then((usuario) => {
                        res.status(201).json({ success: true, msg: 'cadastro realizado !' });
                    })
                    .catch(err => next(err))
            })
            .catch((e) => {
                res.status(400).json(e);

            })
    } catch (e) {
        return res.status(500).json(e);
    }
}

exports.deletarUsuario = async(req, res, next) => {
    const { id } = req.params;

    Usuario.findById(id)
        .then(async(usuario) => {
            if ((usuario.objetos).length > 0) {
                usuario.objetos.forEach(objeto => {
                    Objeto.findById(objeto)
                        .then(async(obj) => {
                            if (obj.isAlugado == true) {
                                return res.status(400).json({ mensagem: 'Não é possivel remover conta com objetos alugados' })
                            }
                            await Objeto.findByIdAndRemove(obj)
                            await Usuario.findByIdAndRemove(id)
                            res.status(200).json({ mensagem: 'Conta deletada !' })
                        })
                        .catch((err) => {
                            res.status(400).json(err)
                        })
                });
            } else {
                Usuario.findByIdAndRemove(id)
                    .then(() => {
                        res.status(200).json({ mensagem: 'Conta deletada !' })
                    })
                    .catch((err) => {
                        res.status(400).json(err, { mensagem: 'Não foi possivel deletar conta' })
                    })
            }

        })
        .catch(err => next(err))

}