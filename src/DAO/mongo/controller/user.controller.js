import userModel from '../models/user.model.js'

export default class Users {

    async checkExistence(email) {
        const user = await userModel.findOne({ email: email })
        if (user) {
            return true
        } else {
            return false
        }
    }

    async getUser(email) {
        try {
            const user = await userModel.findOne({ email: email })
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

}