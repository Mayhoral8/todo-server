const {MongoClient, ServerApiVersion} = require('mongodb')

const uri = "mongodb+srv://Mayhoral:Mayowa787898@cluster0.xoq86dz.mongodb.net/?retryWrites=true&w=majority";

const createProduct = async (req, res)=>{
    const newProduct = {
        name: req.body.name,
        price: req.body.price
    }

    const client = new MongoClient(uri);

try{
    await client.connect();
    const db = client.db();
    const result = db.collection('products').insertOne(newProduct);

}catch(error){
    return res.send(error)
}
res.json(newProduct)
}



const getProducts = async (req, res)=>{
    const client = new MongoClient(uri);
    let products;

try{
    await client.connect();
    const db = client.db();
     products = await db.collection('products').find().toArray();
} catch(error){
    return res.json({message: 'could not resolve products.'})
}
client.close()
res.json(products)
}

module.exports = {createProduct, getProducts}
// const { MongoClient, ServerApiVersion } = require('mongodb');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version


// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
