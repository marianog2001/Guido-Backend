const socket = io()
const productsList = document.querySelector('#productsList')

socket.on('productsUpdate', products => {
    productsList.innerHTML = ''

    products.forEach(item => {
        const li = document.createElement('li')
        li.innerHTML = `
            ${item.title}
        `
        productsList.appendChild(li)
    })
})