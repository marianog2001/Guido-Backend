import mongoose from "mongoose"

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title:String,
    desc:String,
    price:Number,
    thumbnail:Array,
    code:String,
    category:String,
    stock:Number,
    status:Boolean,
    id:{
        type:Number,
        unique:true}
})

const productModel = mongoose.model(productCollection, productSchema)

export default productModel