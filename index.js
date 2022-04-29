const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken');

//middleware
app.use(cors())
app.use(express.json())

//environment variable importing
require('dotenv').config()

const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kwytb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





async function run() {
    try {
        await client.connect();
        console.log('db connect')

        const productCollection = client.db("iham-bikes").collection("bikes");
        // const orderCollection = client.db("gadgetFreak").collection("orders");


        app.get("/products", async (req, res) => {
            const query = {};
            const products = await productCollection.find(query).toArray();
            console.log('inside get /products ->', products)
            res.send(products);
        })


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('This is iham bazar')
})

app.listen(port, () => {
    console.log(`Iham listening to -> ${port}`)
})

// verify token function
function verifyToken(token) {
    let email;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            email = 'Invalid email'
        }
        if (decoded) {
            email = decoded
        }
    });
    return email;
}