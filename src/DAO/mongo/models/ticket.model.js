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

})

/* ticketSchema.plugin(mongoosePaginate) */

const ticketModel = mongoose.model(ticketCollection, ticketSchema)

export default ticketModel