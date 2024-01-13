console.log("script connected")
/* const socket = io() */
searchInput = document.querySelector("#searchInput")
sortOptionSelect = document.querySelector("#sortOptionSelect")



searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter" && searchInput.value.trim().length > 0) {
        console.log("/api/products/?search="+ searchInput.value)
        window.location.href = "/api/products/?search=" + searchInput.value
    }
})

/* ascButton.addEventListener('click', () => {
    let url = new URL(window.location.href)
    url.searchParams.set('sort', 1)
    console.log(url.searchParams)
    window.location.href = url.toString()
}) */

sortOptionSelect.addEventListener("change" , () => {
    let url = new URL(window.location.href)
    const selectedOptionValue = sortOptionSelect.value
    url.searchParams.set("sort", selectedOptionValue)
    window.location.href = url.toString()
})

const showStock = () => {
    let url = new URL(window.location.href)
    url.searchParams.set("stock", true)
    window.location.href = url.toString()
}

const prevButton = (page) => {
    
}

const nextButton = (page) => {
    let url = new URL(window.location.href)
    url.searchParams.set("page", page)
    window.location.href = url.toString()
    console.log(url.toString())
}

/* socket.on('productsUpdate', () => {
    window.location.reload()
}) */