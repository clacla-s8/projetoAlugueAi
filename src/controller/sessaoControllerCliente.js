const jwt = require('jsonwebtoken');
const authConfig = require('../config/autenticacao');
const bcrypt = require('bcrypt');
const Cliente = require('../model/Cliente');

function verificarSenha(senhaEntrada, senha) {
    return bcrypt.compareSync(senhaEntrada, senha);
}

exports.accessTokenCliente = (req, res) => {
    try {
        const { mail, senhaEntrada } = req.body;

        Cliente.findOne({ email: mail })
            .then((cliente) => {
                let { id, email, senha } = cliente;

                try {
                    verificarSenha(senhaEntrada, senha);
                } catch (e) {
                    return res.status(401).json({ error: 'senha does not match' });
                }

                try {
                    return res.json({
                        cliente: {
                            id,
                            email,
                        },
                        token: jwt.sign({ id }, authConfig.secret, {
                            expiresIn: authConfig.expiresIn,
                        }),
                    });
                } catch (e) {
                    return res.status(401).json({ error: 'erro no retorno' });
                }

            })
            .catch((e) => {
                return res.status(401).json({ error: 'anunciante not found' });
            });

    } catch (e) {
        return res.status(401).json({ error: 'erro' });
    }
}