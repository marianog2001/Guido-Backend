import mongoose from "mongoose"

const userCollection = "users"

const userSchema = new mongoose.Schema({
    first_name:String,
    last_name:String,
    email: {
        type: String, 
        unique: true
    },
    age:Number,
    password: String,
    rol: {
        type:String,
        default:"user"
    },
    cartId: String
})

const userModel = new mongoose.model(userCollection, userSchema)

export default userModel