const express = require('express');
const uri = 'mongodb+srv://admin:12345@cluster0.oapaajq.mongodb.net/?retryWrites=true&w=majority';
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Dados = require('./dados');
mongoose.connect(uri);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connected successfully');
});
const router = express.Router();



router.get('/', async function (req,res) {
    Dados.find().then(dados => {

        res.send(dados[0])
    })
})

router.post('/', async function (req,res) {
    const dadoReq = req.body;
    try{
        const dados = new Dados({...dadoReq});
        await dados.save()
        res.send(dados)
    }
    catch(error) {
        console.error(error);
        res.status(500).send(error)
    }
})

router.put('/', async function (req,res) {
    try{
        Dados.find().then(async function(item) {
            const dados = await Dados.findByIdAndUpdate(item[0]._id, req.body, {new:true});
            res.send(dados)
        })
        
        
    }
    catch(error) {
        console.error(error);
        res.status(500).send(error)
    }
})


const app = express();
app.use(bodyParser.json());
app.use('/', router);
app.listen(3000, function () {
    console.log ('servidor iniciado em http://localhost:3000')
})
