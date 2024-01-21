import MessageInsertDTO from '../DTO/message.dto.js'

export class MessageRepository {
    constructor(dao) {
        this.dao = dao
    }

    async createMessage(newMessage) {
        const message = new MessageInsertDTO(newMessage)
        const result = await this.dao.createMessage(message)
        return result
    }

    async getMessages(pageNumber) {
        const result = await this.dao.getMessages(pageNumber)
        return result
    }
}