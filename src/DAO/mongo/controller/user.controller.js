import userModel from '../models/user.model.js'

export default class Users {

    async checkExistence(email) {
        await userModel.exists({ email: email}) ? true : false
    }

    async getUser(email) {
        try {
            const user = await userModel.findOne({ email: email })
            const result = user ?   true :  false
            return result
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