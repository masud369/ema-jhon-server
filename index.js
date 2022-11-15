const express = require('express')
const port = 5000
const bodyParser = require('body-parser')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kz5wbn2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(cors())
app.use(bodyParser.json())



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("db-ema-jhon").collection("emajhon-products");
  const orderCollection = client.db("db-ema-jhon").collection("order-products");
  // perform actions on the collection object
  console.log("database connected properly");

    app.post("/addUser", (req,res)=>{
        const product = req.body;
        // console.log(product);
        collection.insertOne(product)
        .then(result=>{
            console.log(result);
            res.send(res.insertedCount)
        })
    });

    app.get('/porducts', (req,res)=>{
      collection.find({}).limit(20)
      .toArray((err,documents)=>{
        res.send(documents);
      })
    });
    app.get('/porducts/:id', (req,res)=>{
      console.log(req.params.id);
      collection.find({id: req.params.id})
      .toArray((err,documents)=>{
        res.send(documents[0]);
      })
    });

    app.post("/productbyKeys", (req,res)=>{
      const products = req.body;
      collection.find({id: {$in:products}})
      .toArray((err,documents)=>{
        res.send(documents)
     })
    })

    app.post("/orderProducts", (req,res)=>{
      const orderdProducts = req.body;
      orderCollection.insertOne(orderdProducts)
      .then(result=>{
        res.send(result.acknowledged)
        console.log(result);
      })

    })



});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port);