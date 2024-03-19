import CurrentInsertDTO from '../DTO/current.dto.js'
import UserInsertDTO from '../DTO/user.dto.js'

export class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    async getUser(email) {
        const user = await this.dao.getUser(email)
        return user
    }

    async getUsers() {
        let rawUsers = await this.dao.getUsers()
        let returnUsers = rawUsers.map(user => new CurrentInsertDTO(user))
        return returnUsers
    }

    async getUserByID(id) {
        const users = await this.dao.getUserByID(id)
        return users
    }

    async createUser(username) {
        const userToInsert = new UserInsertDTO(username)
        const result = await this.dao.createUser(userToInsert)
        return result
    }

    async checkExistence(username) {
        const result = await this.dao.checkExistence(username)
        return result
    }

    // RESET PASSWORD

    async startPasswordReset(email, resetCode) {
        const result = await this.dao.startPasswordReset(email, resetCode)
        return result
    }

    async resetPassword(resetCode, password) {
        const result = await this.dao.resetPassword(resetCode, password)
        return result
    }

    // PREMIUM 

    async changePremium(id) {
        await this.dao.changePremium(id)
    }
}