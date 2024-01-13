import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const messageCollection = "messages"

const messageSchema = new mongoose.Schema({
    author:String,
    message:String
})

messageSchema.plugin(mongoosePaginate)

const messageModel = mongoose.model(messageCollection, messageSchema)

export default messageModel