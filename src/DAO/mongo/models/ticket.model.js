import mongoose from 'mongoose'


const ticketCollection = 'tickets'

const ticketSchema = new mongoose.Schema({
    code: {
        type : String,
        unique: true,
        required: true
    },
    products:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        }
    ],
    price:Number,
    purchase_datetime: Date,
    purchaser:String,
    status: {
        type:String,
        enum: ['cancelled', 'pending', 'completed'],
        default: 'pending'
    },
    paymentIntent : {
        type: String,
        required: true
    }
})

/* ticketSchema.plugin(mongoosePaginate) */

const ticketModel = mongoose.model(ticketCollection, ticketSchema)

export default ticketModel