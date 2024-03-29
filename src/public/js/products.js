console.log('script connected')
/* const socket = io() */
let searchInput = document.querySelector('#searchInput')
let sortOptionSelect = document.querySelector('#sortOptionSelect')
let addToCartButtons = document.querySelectorAll('.addToCart')


searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' && searchInput.value.trim().length > 0) {
        console.log('/api/products/?search=' + searchInput.value)
        window.location.href = '/api/products/?search=' + searchInput.value
    }
})

sortOptionSelect.addEventListener('change', () => {
    let url = new URL(window.location.href)
    const selectedOptionValue = sortOptionSelect.value
    url.searchParams.set('sort', selectedOptionValue)
    window.location.href = url.toString()
})

const showStock = () => {
    let url = new URL(window.location.href)
    url.searchParams.set('stock', true)
    window.location.href = url.toString()
}

const changePageButton = (page) => {
    let url = new URL(window.location.href)
    url.searchParams.set('page', page)
    window.location.href = url.toString()
    console.log(url.toString())
}

addToCartButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault()
        let productId = button.dataset.id
        const response = await fetch('/api/cart/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
        })
        if (response.ok) {
            // Manejar la respuesta según sea necesario
            console.log('Producto añadido al carrito')
        } else {
            console.error('Error al añadir producto al carrito:', response.statusText)
        }
    }
    )
})

