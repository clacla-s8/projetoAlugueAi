const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../model/Usuario');



function verificarSenha(senhaEntrada, senha) {
    return bcrypt.compareSync(senhaEntrada, senha);
}

exports.accessTokenUsuario = (req, res) => {
    try {
        const { mail, senhaEntrada } = req.body;

        Usuario.findOne({ email: mail })
            .then((usuario) => {
                let { id, email, senha } = usuario;

                try {
                    verificarSenha(senhaEntrada, senha);
                    if (!(verificarSenha(senhaEntrada, senha))) {
                        return res.status(401).json({ success: false, msg: 'senha incorreta' });
                    }
                } catch (e) {
                    return res.status(401).json({ success: false, msg: 'Senha incorreta' });
                }

                try {
                    var token = jwt.sign({ id }, `${process.env.SECRET}`, {
                        expiresIn: `${process.env.EXPIRESIN}`,
                    })
                    if ((verificarSenha(senhaEntrada, senha))) {
                        res.json({ success: true, token: token })
                    }

                } catch (e) {
                    return res.status(401).json({ success: false, msg: 'erro no retorno' });
                }

            })
            .catch((e) => {
                return res.status(401).json({ success: false, msg: 'Usuario não encontrado' });
            });

    } catch (e) {
        hero
        return res.status(401).json({ success: false, msg: 'erro' });
    }
}