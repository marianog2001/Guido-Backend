import mongoose from 'mongoose'


const ticketCollection = 'tickets'

const ticketSchema = new mongoose.Schema({
    code: {
        type : String,
        unique: true,
        required: true
    },
    purchase_datetime: Date,
    amount:Number,
    purchaser:String,

})

/* ticketSchema.plugin(mongoosePaginate) */

const ticketModel = mongoose.model(ticketCollection, ticketSchema)

export default ticketModel