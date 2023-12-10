const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const uri = 'mongodb+srv://admin:12345@cluster0.oapaajq.mongodb.net/?retryWrites=true&w=majority';

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




app.use(bodyParser.json());
app.use(`/api`, router);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "https://backendmco.vercel.app/api");
    app.use(cors());
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
export default app;




