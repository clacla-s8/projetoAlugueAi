const { req, res } = require('express');
const mongoose = require('mongoose');
const { signupAnuncianteSchema } = require('../validators/anunciante');
const Anunciante = require('../model/Anunciante');
const Objeto = require('../model/Objeto');
const Aluguel = require('../model/Aluguel');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;


const obterTodos = async(req, res) => {
    Anunciante.find()
        .then((existeAnunciante) => {
            if (existeAnunciante) {
                res.status(200).json(existeAnunciante)
            }
        })
        .catch((e) => {
            res.status(400).json(e)
        })
}

const atualizarAnunciante = async(req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'id nao é valido' });
        return;
    }

    Anunciante.findByIdAndUpdate(id, req.body)
        .then(() => {
            res.status(200).json({ message: ` ${req.params.id} foi atualizado.` });
        })
        .catch(err => next(err));

}


const salvarAnunciante = async(req, res, next) => {
    const { nome, telefone, endereco, email, senha } = req.body;
    const salt = bcrypt.genSaltSync(bcryptSalt);

    try {
        const validacaoAnunciante = await signupAnuncianteSchema.validate(req.body);

        const anunciante = new Anunciante(validacaoAnunciante);

        Anunciante.findOne({ email: validacaoAnunciante.email })
            .then(async existeAnunciante => {
                if (existeAnunciante) {
                    return res.status(400).json({
                        errors: ['Já existe uma conta com esse e-mail']
                    })
                }

                const senhaEncriptada = await bcrypt.hashSync(senha, salt);
                anunciante.senha = senhaEncriptada;
                anunciante.save()
                    .then((anunciante) => {
                        res.status(201).json({ mensagem: 'Cadastro realizado com sucesso' });
                    })
                    .catch(err => next(err))
            })
            .catch((err) => {
                res.status(400).json(err)
            })
    } catch (e) {
        return res.status(400).json(e)
    }
}

const deletarAnunciante = async(req, res, next) => {
    const { id } = req.params;

    Anunciante.findById(id)
        .then(async(anunciante) => {
            if ((anunciante.objetos).length > 0) {
                if ((anunciante.objetos).includes(Aluguel.objetoId)) {
                    return res.status(400).json({ message: 'Espere a devolução dos objetos alugados para deletar conta' })
                }
            }
            Anunciante.findByIdAndRemove(id)
                .then(() => {
                    res.status(200).json({ message: 'Conta deletada !' })
                })
                .catch((err) => {
                    res.status(400).json(err, { message: 'Não foi possivel deletar conta' })
                })
        })


}


module.exports = {
    obterTodos,
    atualizarAnunciante,
    salvarAnunciante,
    deletarAnunciante
}