const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const uri = 'mongodb+srv://admin:12345@cluster0.oapaajq.mongodb.net/?retryWrites=true&w=majority';

const bodyParser = require('body-parser');
const Dados = require('./dados');

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connected successfully');
});

// Configuração do CORS
app.use(cors({ origin: '*' }));

// Middleware para interpretar corpos JSON nas requisições
app.use(bodyParser.json());

const router = express.Router();

router.get('/', async function (req, res) {
    try {
        const dados = await Dados.find();
        res.send(dados[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

router.post('/', async function (req, res) {
    const dadoReq = req.body;
    try {
        const dados = new Dados({ ...dadoReq });
        await dados.save();
        res.send(dados);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

router.put('/', async function (req, res) {
    try {
        const item = await Dados.find();
        const dados = await Dados.findByIdAndUpdate(item[0]._id, req.body, { new: true });
        res.send(dados);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// Rotas da API prefixadas com '/api'
app.use('/api', router);

export default app;