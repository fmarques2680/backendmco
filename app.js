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
        console.log('Requisição PUT recebida:', req.body);  // Adicione esta linha

        const item = await Dados.findOne();

        // Verifica se existe um documento para atualizar
        if (!item) {
            console.error('Nenhum documento encontrado para atualização.');
            return res.status(404).send('Nenhum documento encontrado para atualização.');
        }

        // Atualiza apenas os campos presentes em req.body
        const updatedFields = { $set: req.body };
        const dados = await Dados.findByIdAndUpdate(item._id, updatedFields, { new: true });
        console.log('Dados atualizados:', dados);  // Adicione esta linha

        // Verifica se a atualização foi bem-sucedida antes de enviar a resposta
        if (!dados) {
            console.error('Erro durante a atualização.');
            return res.status(500).send('Erro durante a atualização.');
        }

        console.log('Atualização bem-sucedida:', dados);
        res.send(dados);
    } catch (error) {
        console.error('Erro durante a atualização:', error);
        res.status(500).send(error.message || 'Erro interno no servidor.');
    }
});




// Rotas da API prefixadas com '/api'
app.use('/api', router);

export default app;