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
    button.addEventListener('click', (e) => {
        e.preventDefault()
        let user = JSON.parse(localStorage.getItem('user'))
        if (!user) { window.location.href = '/register'}
        let productId = button.dataset.id
        console.log(user)
        //console.log(button.dataset.id)
    }
    )
})

/* const addToCart = (productId, cartId) => {
    console.log(cartId)
    if (cartId === undefined) {
        console.log('hola')

    }
    console.log(productId, cartId)
} */

