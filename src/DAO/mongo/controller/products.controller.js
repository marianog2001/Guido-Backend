import productModel from '../models/products.models.js'

export default class Products {

    async getProducts(limit, page, searchQuery, sortQuery, stockQuery, categoryQuery) {
        try {
            let query = {}
            let options = {
                limit,
                page,
                lean: true,
            }
            if (categoryQuery) { query.category = categoryQuery.replace(/_/g, ' ') }
            if (searchQuery) { query.$text = { $search: searchQuery } } //añade $text a la query si es distinto de null
            if (sortQuery) { options.sort = { price: sortQuery } }
            if (stockQuery) { query.stock = { $gt: 0 } }

            const result = await productModel.paginate(query, options)

            return result

        } catch (error) {
            console.error('error fetching data:' + error)
            return error
        }
    }


    async getOneProduct(pid) {
        try {
            const product = await productModel.findOne({ _id: pid }).lean().exec()
            return product
        }
        catch (error) {
            return error
        }
    }


    async createOneProduct(newProduct) {
        try {            
            const result = await productModel.create(newProduct)
            return result
        }
        catch (error) {
            return error
        }
    }


    async updateOneProduct(pid, updated) {
        try {
            await productModel.updateOne({ _id: pid }, updated)
        } catch (error) {
            return error
        }
    }

    async deleteOneProduct(pid) {
        try {
            await productModel.deleteOne({ id: pid })
        } catch (error) {
            return error
        }
    }


}











