const { log } = require('console')
const fs = require('fs')
const dbDir = './MyDB.json'

class ProductManager {
    constructor(dbDir) {
        this.path = dbDir
        this.format = 'utf-8'
    }

    /* -------------------------------------------------------------------------------------------- */

    isFileEmpty = async () => {
        try {
            const stats = fs.statSync(this.path);
            return stats.size === 0;
        } catch (e) {
            console.error(e);
            return false;
        }
    }


    getProducts = async () => {
        if (!fs.existsSync(this.path)) { return [] } else {
            if (await this.isFileEmpty()) {return []} else {
                return fs.promises.readFile(this.path, this.format)
                .then(response => JSON.parse(response))
                .catch(e => {
                    console.log('this error appeared! : ' + e)
                    return []
                })
            }            
        }
    }

    /* -------------------------------------------------------------------------------------------- */

    addProducts = async (title, desc, price, thumbnail, code, stock) => {

        const products = await this.getProducts()

        const codeValidation = (code, products) => {
            return products.some(product => product.code === code)
        }

        if (codeValidation(code, products)) {
            return console.log("there already is a product with the same code in the list.")
        }

        const product = {
            title: title,
            desc: desc,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
            id: products.length + 1
        }

        if (Object.values(product).includes(undefined)) {
            return console.log('The product has fields in blank!!!!')
        }

        products.push(product)

        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products))
        }
        catch {
            console.log(error)
        }

    }

    /* -------------------------------------------------------------------------------------------- */

    getProductById = async (id) => {
        let products = await this.getProducts()
        let product = products.find((product) => product.id === id)
        if (product) { return console.table(product) }
        else { return console.log('there are no products matching that id') }
    }

    /* -------------------------------------------------------------------------------------------- */

    deleteProduct = async (id) => {
        let products = await this.getProducts()
        let newProducts = products.filter(product => product.id !== id)
        newProducts.forEach((product, index) => { product.id = index+1 })
        fs.promises.writeFile(this.path, JSON.stringify(newProducts))
    }

    /* -------------------------------------------------------------------------------------------- */

    updateProduct = async (id, updates) => {
        let products = await this.getProducts()
        let product = products.find(product => product.id === id)
        if (!product) { return console.log('product id not found') }
        else {
            product.title = updates.title ? updates.title : product.title
            product.desc = updates.desc ? updates.desc : product.desc
            product.price = updates.price ? updates.price : product.price
            product.thumbnail = updates.thumbnail ? updates.thumbnail : product.thumbnail
            product.code = updates.code ? updates.code : product.code
            product.stock = updates.stock ? updates.stock : product.stock

            console.log('UPDATED')
            console.table(product)

            await fs.promises.writeFile(this.path, JSON.stringify(products))
        }

    }

}

const pManager = new ProductManager(dbDir)


async function run() {

    await pManager.addProducts(
        'prueba 1',
        'desc p 1 ',
        10,
        'prueba.jpeg',
        'aab',
        100
    )

    await pManager.addProducts(
        'segundo',
        'desc 2',
        20,
        'test.webp',
        'qwe',
        200
    )

    await pManager.updateProduct(1,{title:'wopa',code:'PPPPPP'})


}

run()



/* await pManager.updateProduct(1,{title:'pruebaza',precio:'9999'}) */