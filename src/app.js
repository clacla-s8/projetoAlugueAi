const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();

mongoose.connect(`${process.env.DATABASE_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});


const usuarios = require('./routes/usuarioRoutes');
const objetos = require('./routes/objetoRoutes');
const alugueis = require('./routes/aluguelRoutes');
const sessions = require('./routes/sessaoRoute');
const index = require('./routes/index');

//app.use('/uploads', express.static(__dirname + './uploads'));

//app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());


app.use('/usuario', usuarios);
app.use('/objeto', objetos);
app.use('/aluguel', alugueis);
app.use('/sessao', sessions);
app.use('/', index);

module.exports = app;