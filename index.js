const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        //all products
        app.get("/products", async (req, res) => {
            const query = {};
            const products = await productCollection.find(query).toArray();
            // console.log('inside get /products ->', products)
            res.send(products);
        })

        //single product
        app.get("/product/:id", async (req, res) => {
            const id = req.params.id;
            const product = await productCollection.findOne({ _id: ObjectId(id) });
            res.send(product);
        })

        //updating a product
        app.put('/update-product/:id', async (req, res) => {
            const id = req.params.id;
            const updatedBikeInfo = req.body;
            console.log(updatedBikeInfo);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedBikeInfo.quantity
                }
            }
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        //deleting a product
        //deleting a user
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(query);
            // const result = await productCollection.deleteOne(query);
            // res.send(result);
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