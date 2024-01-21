import messageModel from '../models/message.model.js'

export default class Messages {
    async createMessage(newMessage) {
        await messageModel.create(newMessage) 
    }

    //this method returns a page of messages containing the last 10 messages by default or the last 10 messages that match the page
    async getMessages(pageNumber) {
        pageNumber = pageNumber || Math.ceil(await messageModel.countDocuments() / 10)
        return await messageModel.paginate({}, { limit: 10, page: pageNumber })
    }
}