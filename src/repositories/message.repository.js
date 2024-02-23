export class MessageRepository {
    constructor(dao) {
        this.dao = dao
    }

    async createMessage(newMessage) {
        const result = await this.dao.createMessage(newMessage)
        return result
    }

    async getMessages(pageNumber) {
        const result = await this.dao.getMessages(pageNumber)
        return result
    }
}