const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require("cors");
require('dotenv').config();

const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;
const app = express();
// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jyrw6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("triptracker");
        const userInfoCollection = database.collection("userInfo");

        const database2 = client.db("travel-house");
        const servicesCollection = database2.collection("services");
        

        // GET API for find multiple data.
        app.get("/services", async(req, res) => {
                const cursor = servicesCollection.find({});
                const services = await cursor.toArray();
                res.send(services);
            });
            
        // GET API for find single data.
        app.get("/service/:id", async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const oneService = await servicesCollection.findOne(query);
            res.send(oneService);
        });
        

        // POST API for create single data
        app.post("/service", async(req, res) => {
            const service = req.body;
            const singleService = await  servicesCollection.insertOne(service);
            res.json(singleService);
        });

        // API single data updated
        app.put("/update/:id", async(req, res) => {
            const id = req.params.id;
            const updateService = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateService.name,
                    price: updateService.price
                }
            }
            const updatedService = await servicesCollection.updateOne(filter, updateDoc, options);
            res.json(updatedService);

        });

        // delete api
        app.delete("/service/:id", async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deleteUser = await  servicesCollection.deleteOne(query);
            res.send(deleteUser)
        });

        

        app.delete("/userInfo/:id", async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const deleteService = await userInfoCollection.deleteOne(query);
            res.send(deleteService)
        });

        app.post("/userInfo", async(req, res) => {
            const user = req.body;
            const singleUser = await userInfoCollection.insertOne(user);
            res.json(singleUser);
        });

        app.get("/userInfo/:id", async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const findService = await userInfoCollection.findOne(query);
            res.send(findService)
        });

        app.get("/usersInfo", async(req, res) => {
            const cursor = userInfoCollection.find({});
            const usersInfo = await cursor.toArray();
            res.send(usersInfo);
        });


    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Travel house server working working.');
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});