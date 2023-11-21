import mongoose from "mongoose"

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            _id: false,
            product: mongoose.ObjectId,
            quantity: Number,
        }],
        default: [],
    }
})

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel