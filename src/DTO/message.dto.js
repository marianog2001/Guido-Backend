export default class MessageInsertDTO {
    constructor(message) {
        this.message = message?.message ?? ''
        this.author = message?.author ?? 'anon'
        this.timestamp = message?.timestamp ?? new Date().toString()
    }
}