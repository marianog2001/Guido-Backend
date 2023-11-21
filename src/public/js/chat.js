const socket = io()
const chatBox = document.querySelector('#chatBox')

chatBox.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' && chatBox.value.trim().length > 0) {
        const newMessage = chatBox.value
        socket.emit('message', newMessage)
        chatBox.value = ''
    }

socket.on('logs', messages => {

    const box = document.querySelector('#chatBox')

    let html = ''

    messages.reverse().forEach(message => {
        html += `<p>${message}</p>`
    })
    box.innerHTML = html

    })


})