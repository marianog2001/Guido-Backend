import fs from 'fs'

class ProductManager {
    constructor() {
        this.path = './src/MyDB.json'
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
            if (await this.isFileEmpty()) { return [] } else {
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

    addProducts = async (title, desc, price, thumbnail, code, category, stock) => {

        const products = await this.getProducts()

        const codeValidation = (code, products) => {
            return products.some(product => product.code === code)
        }

        if (codeValidation(code, products)) {
            return console.log("there already is a product with the same code in the list.")
        }

        if (Object.values({title:title,desc:desc,price:price,code:code,category:category,stock:stock}).includes(undefined)) {
            return console.error('falta algun dato')
        }

        if (!thumbnail) {
            thumbnail = []
        } else if (!Array.isArray(thumbnail)) {
            thumbnail = [thumbnail]
        }

        const product = {
            title: title,
            desc: desc,
            price: price,
            thumbnail: thumbnail,
            code: code,
            category: category,
            stock: stock,
            status: true,
            id: products[products.length - 1].id + 1
        }

        products.push(product)

        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products))
            return products
        }
        catch {
            console.log('ha habido un error')
        }

    }

    /* -------------------------------------------------------------------------------------------- */

    getProductById = async (id) => {
        let products = await this.getProducts()
        let product = products.find((product) => product.id === id)
        if (product) { return product }
        else { return console.log('there are no products matching that id') }
    }

    /* -------------------------------------------------------------------------------------------- */

    deleteProduct = async (id,res) => {
        let products = await this.getProducts()
        let newProducts = products.filter(product => product.id !== id)
        fs.promises.writeFile(this.path, JSON.stringify(newProducts))
        res.status(200).json({message:'product deleted'})
    }

    /* -------------------------------------------------------------------------------------------- */

    updateProduct = async (id, updates, res) => {

        let products = await this.getProducts()
        let product = products.find(product => product.id === id)
        if (!product) { return res.status(400).json({message:'product not found'}) }
        else {
            product.title = updates.title ? updates.title : product.title
            product.desc = updates.desc ? updates.desc : product.desc
            product.price = updates.price ? updates.price : product.price
            product.thumbnail = updates.thumbnail ? updates.thumbnail : product.thumbnail
            product.code = updates.code ? updates.code : product.code
            product.category = updates.category ? updates.category : product.category
            product.stock = updates.stock ? updates.stock : product.stock
            product.status = updates.status ? updates.status : product.status

            res.status(200).json({product})

            await fs.promises.writeFile(this.path, JSON.stringify(products))
        }

    }

}

export default ProductManager = new ProductManager()


