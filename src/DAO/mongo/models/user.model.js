import mongoose from 'mongoose'

const userCollection = 'users'

const validRole = ['user', 'admin', 'premium']

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    role: {
        type: String,
        enum: validRole,
        default: 'user'
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    }
})

userSchema.pre('findOne', function() {
    this.populate('cartId')
})

const userModel = new mongoose.model(userCollection, userSchema)

export default userModel