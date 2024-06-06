const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = 5000

// midlewar
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@simple-crud.ce5cqwx.mongodb.net/?retryWrites=true&w=majority&appName=Simple-crud`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const database = client.db('Assignment11').collection('recipes')

app.get('/recipes', async (req, res) => {
  try {
    const email = req.query.email
    const query = {}
    if (email) {
      query.email = email
    }

    const result = await database.find(query).toArray()
    res.send(result)
  }
  catch (error) {
    console.log(error);
  }
})
app.get('/recipes/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  try {
    const result = await database.findOne(query)
    res.send(result)
  }
  catch (error) {
    console.log(error);
  }
})
app.post('/recipes', async (req, res) => {
  try {
    const obj = req.body
    const result = await database.insertOne(obj)
    res.send(result)
  }
  catch (error) {
    console.log(error);
  }
})
app.put('/recipes/:id', async (req, res) => {
  const id = req.params.id;
  const obj = req.body;
  try {
    const filter = { _id: new ObjectId(id) }
    const options = { upsert: true }
    const updateObj = {
      $set: {

        title: obj.title,
        recipeImg: obj.recipeImg,
        description: obj.description,
        ingredients: obj.ingredients,
        instructions: obj.instructions,
        cuisineType: obj.cuisineType,
        difficulty: obj.difficulty,
        price: obj.price,
        rating: obj.rating,
        category: obj.category
      }
    }
    const result = await database.updateOne(filter, updateObj, options)
    res.send(result)
  }
  catch (error) {
    console.log(error);
  }

})
app.delete('/recipes/:id', async (req, res) => {
  const id = req.params.id
  try {
    const filter = { _id: new ObjectId(id) }
    const result= await database.deleteOne(filter)
    res.send(result)
  }
  catch (error) {
    console.log(error);
  }
})

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', async (req, res) => {
  res.send('server is runing properly')
})

app.listen(port, () => {
  console.log(`server is runing on port ${port}`);
})