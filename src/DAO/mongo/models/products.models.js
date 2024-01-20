import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title:String,
    desc:String,
    price:Number,
    thumbnail:Array,
    code:String,
    category:String,
    stock:Number,
    status:Boolean
})

productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model(productCollection, productSchema)

export default productModel