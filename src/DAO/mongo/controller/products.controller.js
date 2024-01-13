import productModel from "../models/products.models.js"

export const getProducts = async (req, res) => {
    try {
        let limit = parseInt(req.query?.limit ?? 10)
        let page = parseInt(req.query?.page ?? 1)
        let searchQuery = req.query?.search ?? null
        let sortQuery = parseInt(req.query?.sort) ?? null
        let catQuery = (req.query?.cat) ?? null
        let stockQuery = (req.query?.stock === "true") ?? null
        let query = {}
        let options = {
            limit, page, lean: true,
        }
        if (catQuery) { query.category = catQuery.replace(/_/g, " ") }
        if (searchQuery) { query.$text = { $search: searchQuery } } //añade $text a la query si es distinto de null
        if (sortQuery) {
            options.sort = { price: sortQuery }
        }
        if (stockQuery) { query.stock = { $gt: 0 } }
        const result = await productModel.paginate(query, options)
        result.user = req.session.user
        return res.status(200).render("products", result)

    }
    catch (e) {
        return res.send("an error ocurred:" + e)
    }
}

/* router.get("/", async (req, res) => {
    try {
        let limit = parseInt(req.query?.limit ?? 10)
        let page = parseInt(req.query?.page ?? 1)
        let searchQuery = req.query?.search ?? null
        let sortQuery = parseInt(req.query?.sort) ?? null
        let catQuery = (req.query?.cat) ?? null
        let stockQuery = (req.query?.stock === "true") ?? null
        let query = {}

        let options = {
            limit, page, lean: true,
        }
        if (catQuery) { query.category = catQuery.replace(/_/g, " ") }
        if (searchQuery) { query.$text = { $search: searchQuery } } //añade $text a la query si es distinto de null
        if (sortQuery) {
            options.sort = { price: sortQuery }
        }
        if (stockQuery) { query.stock = { $gt: 0 } }

        const result = await productModel.paginate(query, options)

        result.user = req.session.user

        return res.status(200).render("products", result)

    }
    catch (e) {
        return res.send("an error ocurred:" + e)
    }
}
) */

export const getOne = async (req, res) => {
    try {
        const product = await productModel.findOne({ _id: req.params.pid }).lean().exec()
        return res.status(200).render("productDetail", product)
    } catch (error) {
        res.status(500).send({ message: "error fetching data:" + error })
    }
}

/* router.get("/:pid", async (req, res) => {
    try {
        const product = await productModel.findOne({ _id: req.params.pid }).lean().exec()
        return res.status(200).render("productDetail", product)
    } catch (err) {
        res.send("an error has occurred:" + err)
    }
}) */

export const createOne = async (req, res) => {
    try {
        const newProduct = req.body
        const result = await productModel.create(newProduct)
        req.app.get("socketio").emit("productsUpdate")
        return res.status(200).json(result)
    }

    catch (error) {
        console.log(error)
        return res.status(400).json({ message: error })
    }
}


/* router.post("/", async (req, res) => {
    try {
        const newProduct = req.body
        console.log(newProduct)
        const result = await productModel.create(newProduct)
        const updatedProducts = await productModel.find().lean().exec()
        req.app.get("socketio").emit("productsUpdate")
        return res.status(200).json(result)
    }

    catch (error) {
        console.log(error)
        return res.status(400).json({ message: error })
    }
}) */

export const updateOne = async (req, res) => {
    try {
        const pid = req.params.pid
        if (req.body.id !== pid && req.body.id !== undefined) {
            return res.status(404).json({ error: "cant modify products id" })
        }
        const updated = req.body
        const productToUpdate = await productModel.findById(pid)
        if (!productToUpdate) {
            return res.status(404).json({ error: "no product matches that id" })
        }
        await productModel.updateOne({ _id: pid }, updated)
        const updatedProducts = await productModel.find().lean().exec()
        req.app.get("socketio").emit("productsUpdate", updatedProducts)
        res.status(200).json({ message: "updating product" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error })
    }
}

/* router.put("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid
        if (req.body.id !== pid && req.body.id !== undefined) {
            return res.status(404).json({ error: "cant modify products id" })
        }
        const updated = req.body
        const productToUpdate = await productModel.findById(pid)
        if (!productToUpdate) {
            return res.status(404).json({ error: "no product matches that id" })
        }
        await productModel.updateOne({ _id: pid }, updated)
        const updatedProducts = await productModel.find().lean().exec()
        req.app.get("socketio").emit("productsUpdate", updatedProducts)
        res.status(200).json({ message: "updating product" })
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: error })
    }
}) */

export const deleteOne = async (req, res) => {
    try {
        let id = parseInt(req.params.pid)
        await productModel.deleteOne({ id: id })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ message: error })
    }
}

/* router.delete("/:pid", async (req, res) => {
    try {
        let id = parseInt(req.params.pid)
        await productModel.deleteOne({ id: id })
    }
    catch (e) {
        console.error(e)
        return res.status(500).json({ message: error })
    }
})
 */


/* export default router */