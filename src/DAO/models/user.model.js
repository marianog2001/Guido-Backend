import mongoose from "mongoose";

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    first_name:String,
    last_name:String,
    email: {
        type: String, 
        unique: true
    },
    password: String,
    rol: {
        type:String,
        default:"usuario"
    }
})

const userModel = new mongoose.model(userCollection, userSchema)

export default userModel