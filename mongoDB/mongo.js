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

