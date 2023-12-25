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
    app.post("/add-tasks", async (req, res) => {
      try {
        const tasks = req.body;
        const result = await tasksCollection.insertOne(tasks);
        res.send(result);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    app.get("/get-tasks/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = { email: email };
        const result = await tasksCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });
    app.get("/get-task/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await tasksCollection.findOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });
    app.put("/update-task/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedTasks = req.body;
        const query = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            ...updatedTasks
          },
        };
        const result = await tasksCollection.updateOne(
          query,
          updateDoc,
          options
        );
        res.send(result);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });
    app.delete("/delete-tasks/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await tasksCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });
    app.patch("/task-type-update/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const newType = req.body;
        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            type: newType.type,
          },
        };
        const result = await tasksCollection.updateOne(query, updateDoc);
        res.send(result);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
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
