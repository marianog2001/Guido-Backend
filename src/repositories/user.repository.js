import UserInsertDTO from '../DTO/user.dto.js'

export class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    async getUser(email) {
        const user = await this.dao.getUser(email)
        return user
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


}