import userModel from '../models/user.model.js'
import passwordResetModel from '../models/passwordReset.model.js'
import { createHash, passwordValidator } from '../../../services/auth.services.js'

export default class Users {

    async checkExistence(email) {
        await userModel.exists({ email: email }) ? true : false
    }

    async getUser(email) {
        try {
            const user = await userModel.findOne({ email: email })
            if (!user) {
                throw new Error('User not found')
            }
            return user
        } catch (error) {
            console.error('Error getting user : ' + error)
            return error
        }
    }

    async createUser(newUser) {
        try {
            let user = await userModel.create(newUser)
            return user
        } catch (error) {
            console.error('Error creating user : ' + error)
            return error
        }
    }

    async getUserByID(id) {
        try {
            const user = await userModel.findById(id)
            return user
        } catch (error) {
            console.error('Error getting user by ID : ' + error)
            return error
        }
    }

    async getUsers() {
        try {
            const users = await userModel.find()
            return users
        } catch (error) {
            console.error(error)
            return error
        }
    }

    // RESET PASSWORD

    async startPasswordReset(email, resetCode) {
        try {
            const user = await userModel.findOne({ email: email })
            if (!user) {
                throw new Error('Email is not associated')
            }
            let passwordReset = new passwordResetModel({
                userEmail: email,
                resetCode: resetCode
            })
            await passwordReset.save()
            return { success: true, result: passwordReset }
        } catch (error) {
            console.error(error)
            return error
        }
    }

    async resetPassword(resetCode, newPassword) {
        try {
            const passwordReset = await passwordResetModel.findOne({ resetCode: resetCode })
            if (!passwordReset) {
                throw new Error('Reset code not found')
            }
            const user = await userModel.findOne({ email: passwordReset.userEmail })
            if (!user) {
                throw new Error('User not found')
            }
            if (passwordValidator(user, newPassword)) {

                // NECESARIO CAMBIAR PARA QUE NO CORTE EL FLUJO DE LA APP

                throw new Error('Cannot put the same password as the old one')
            }
            user.password = createHash(newPassword)
            await user.save()
            await passwordResetModel.deleteOne({ resetCode: resetCode })
            return { success: true }
        } catch (error) {
            console.error('Error in reset password function: ' + error)
            throw error
        }
    }

    // PREMIUM FEATURES

    async changePremium(id) {
        try {
            const user = await userModel.findById(id)
            if (!user) {
                throw new Error('User not found')
            }
            if (user.role === 'premium') {
                user.role = 'user'
            } else if (user.role === 'user') {
                user.role = 'premium'
            }

            await user.save()

            return
        } catch (error) {
            console.error('Error in change premium function: ' + error)
            throw error
        }
    }

}