const { mongoose } = require('mongoose')
const Product = require('./schema')




const createProduct = async (req, res, next)=>{
    const createdProduct = new Product({
    name: req.body.name,
    price: req.body.price
    })
   const result = await createdProduct.save()
    res.json(result);
}

const getProducts = async(req, res)=>{
Product.find().exec()
.then((products)=>{
    res.json(products)
})
}

module.exports = {createProduct, getProducts};