import mongoose from 'mongoose'



const passwordResetSchema = new mongoose.Schema({
    userEmail: { type: String, required:true },
    resetCode: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 3600 }
})



const passwordResetModel = mongoose.model('passwordReset', passwordResetSchema)

export default passwordResetModel