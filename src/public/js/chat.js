
const socket = io()
const chatBox = document.querySelector('#chatBox')
const chatInput = document.querySelector('#chatInput')
const usernameInput = document.querySelector('#usernameInput')


chatInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' && chatInput.value.trim().length > 0) {
        let username = usernameInput.value || 'anon'
        const newMessage = { author: username, message: chatInput.value }
        console.log(newMessage)
        socket.emit('emit message', newMessage)
        chatInput.value = ''
    }
})

socket.on('logs', messages => {
    messages.docs.forEach(eachMessage => {
        let { author, message } = eachMessage
        const p = document.createElement('p')
        p.textContent += `
        ${author}:${message}
        
        `
        chatBox.appendChild(p)
        
    })

    socket.on('render message', async newMessage => {
        let { author, message } = newMessage
        const p = document.createElement('p')
        p.textContent += `
        ${author}:${message}
        
        `
        chatBox.appendChild(p)
    })
})

