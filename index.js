const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
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