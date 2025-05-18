const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(express.json())
app.use(cors())




const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.ws0fker.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const userCollections = client.db('allUser').collection('users')

        app.get('/user', async (req, res) => {

            const coursor = await userCollections.find().toArray()
            res.send(coursor)

        })

        app.get('/user/:id', async (req,res) => {
            const id= req.params.id 
            const query = { _id : new ObjectId(id)}
            const result = await userCollections.findOne(query)
            res.send(result)
        })

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await userCollections.deleteOne(query)
            res.send(result)
        })

        app.put('/user/:id', async (req, res) => {
            const id = req.params.id 
            const query = { _id : new ObjectId(id)}
            const data = req.body
            const options = { upsert : true }
            const updatedoc = {
                $set : {
                    data
                }
            }
            const result = await userCollections.updateOne(query,updatedoc,options)
            res.send(result)
        })

        app.post('/user', async (req, res) => {
            const newUser = req.body
            const query = { name: newUser.name }
            const userCk = await userCollections.findOne(query)
            console.log(userCk)
            if (userCk) {
                return res.status(409).send({ error: 'User already exists' });
            }
            const result = await userCollections.insertOne(newUser)
            res.send(result)
        })






    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("server side is running")
})

app.listen(port, () => {
    console.log(`server side is runnig port ${port}`)
})