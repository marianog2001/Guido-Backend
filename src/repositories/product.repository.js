import ProductInsertDTO from '../DTO/product.dto.js'

export class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    async getProducts(limit, page, searchQuery, sortQuery, stockQuery, categoryQuery) {
        const products = await this.dao.getProducts(limit, page, searchQuery, sortQuery, stockQuery, categoryQuery)
        return products
    }

    async getOneProduct(pid) {
        const product = await this.dao.getOneProduct(pid)
        return product
    }

    async createProduct(product) {
        const newProduct = new ProductInsertDTO(product)
        const addedProduct = await this.dao.createProduct(newProduct)
        return addedProduct
    }

    async updateOneProduct(pid, updated) {
        const updatedProduct = await this.dao.updateOneProduct(pid, updated)
        return updatedProduct
    }

    async deleteProduct(pid) {
        const deletedProduct = await this.dao.deleteProduct(pid)
        return deletedProduct
    }
}