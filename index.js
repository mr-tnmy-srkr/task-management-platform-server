const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());
require("dotenv").config();


const client = new MongoClient(process.env.DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const tasksCollection = client.db("taskManagementDB").collection("tasks");

async function run() {
  try {
     // Connect the client to the server	(optional starting in v4.7)
  client.connect();
  app.post("/tasks", async (req, res) => {
    const tasks = req.body;
    const result = await tasksCollection.insertOne(tasks);
    res.send(result);
  });

    // Send a ping to confirm a successful connection
    try {
    client.db("admin").command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    } catch (pingError) {
      console.error("MongoDB ping error:", pingError);
    }
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task Management Server is running..");
});

app.listen(port, () => {
  console.log(`Task Management Server is running on port ${port}`);
});
