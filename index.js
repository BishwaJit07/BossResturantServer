const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.gq6gqcm.mongodb.net/?retryWrites=true&w=majority`;

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

    const usersCollection = client.db("RestroDB").collection("users");
    const menuCollection = client.db("RestroDB").collection("Menu");
    const reviewsCollection = client.db("RestroDB").collection("Reviews");
    const cartCollection = client.db("RestroDB").collection("carts");

    // users related api 
    app.get('/users',async(req,res)=>{
      const result = await usersCollection.find().toArray();
      return res.send(result);
  })

    app.post('/users', async(req,res)=>{
      const user = req.body;
      console.log(user);
      const query= {email: user.email};
      const excitingUser = await usersCollection.findOne(query);
      console.log("existing User", excitingUser);

      if(excitingUser){
        return res.send ({message: 'user already exists'})
      }
      const result = await usersCollection.insertOne(user);
      return res.send(result)
    })


  //  menuRelated Api 

    app.get('/menu',async(req,res)=>{
        const result = await menuCollection.find().toArray();
        return res.send(result);
    })
    
    // review Related api 
    app.get('/reviews',async(req,res)=>{
        const result = await reviewsCollection.find().toArray();
        return res.send(result);
    })

    // cart colllection 
    app.get('/carts',async(req,res)=>{
      const email = req.query.email;
      console.log(email);
      if(!email){
        return res.send([]);
      }
      const query = {email:email};
      const result = await cartCollection.find(query).toArray();
      return res.send(result)
    });

    app.post('/carts', async(req,res)=>{
            const item = req.body;
            console.log(item);
            const result = await cartCollection.insertOne(item);
           return res.send(result)
    })

    app.delete('/carts/:id',async(req,res)=>{
         const id= req.params.id;
         const query={ _id: new ObjectId(id)}; 
         const result = await cartCollection.deleteOne(query);
         return res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("restro Boss running")
})

app.listen(port,()=>{
    console.log(`restro port ${port}`);
})