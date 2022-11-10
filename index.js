const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors())
app.use(express.json())

// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hpvuccm.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const cakeCollection = client.db('candleCake').collection('cakes')
        const reviewCollection = client.db('candleCake').collection('reviews')
        const serviceCollection = client.db('candleCake').collection('services')

        app.get('/cakes', async (req, res) => {
            const query = {}
            const cursor = cakeCollection.find(query);
            const cakes = await cursor.limit(3).toArray();
            res.send(cakes)
        })
        app.get('/cakeDetails', async (req, res) => {
            const query = {}
            const cursor = cakeCollection.find(query);
            const cakeDetails = await cursor.toArray();
            res.send(cakeDetails)
        })

        app.get('/cakeDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cake = await cakeCollection.findOne(query);
            res.send(cake)
        })

        // review api

        app.get('/reviews', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review)
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        })

        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        })


        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    status: status
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc);
            res.send(result)
        })

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result)
        })

        // service api
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result)
        })


    }
    finally {

    }
}
run().catch(err => console.error(err))


app.get('/', (req, res) => {
    res.send('Candle cake service running')
})

app.listen(port, () => {
    console.log(`candle cake service running on ${port}`)
})


// candleCakeDBUser
// 8v9HsJbdULbtWfqQ