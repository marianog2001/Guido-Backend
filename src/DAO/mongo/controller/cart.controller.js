import CartModel from "../models/cart.models.js"
import ProductModel from "../models/products.models.js"

//CREATE CART (WITH OR WITHOUT AN ITEM)

export const createCart = (req,res) => {
    try {
        let pid = req.body.id
        let cart = new CartModel()
        if (pid) {
            cart.products.push({product:pid})
            cart.save()
            return res.status(200).json({status : "done"})
        }
        
        cart.save()
        return res.status(200).json({status : "done"})
    }
    catch (error) {
        console.log("error creating cart: " + error)
        return res.status(500).json({ message: "server error." })
    }
}

//SEE CART
export const getCart = async(req,res) => {
    try {
        let cid = req.params.cid
        let cart = await CartModel.findById(cid).populate("products.product")
        console.log(cart)
        res.status(200).json({ status:"success",payload:cart})
    } catch (error) {
        console.log("error getting cart: " + error)
        return res.status(500).json({ message: "server error." })
    }
}

//ADD ONE ELEMENT TO A CART

export const addElementToCart = async (req,res) => {
    try {
        let cid = req.params.cid
        let pid = req.params.pid
        let cart = await CartModel.findById(cid)
        if (!cart) {
            console.log("couldn't find cart")
            return res.status(404).json({ message: "Cart not found" })
        }
        let product = await ProductModel.findById(pid)
        if (!product) {
            console.log("couldn't find product")
            return res.status(404).json({ message: "Product not found" })            
        }
        let productIndex = cart.products.findIndex(item => item.product.toString() === pid)
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1
        } else {
            const newProduct = {
                product: pid,
                quantity: 1,
            }
            cart.products.push({product:newProduct})
        }
        let result = await cart.save()
        result = await cart.findById(cid)
        console.log(result)
        res.status(200).json({ status: "success", payload: result })

    } catch (e) {
        console.error("an error ocurred trying to update the cart : " + e )
        return res.status(500).json({ message: "server error." })
    }
}

//DELETE AN ENTIRE CART

export const deleteCart = async (req,res) => {
    try {
        const cid = req.params.cid
        let cartToDelete = await CartModel.findById(cid)
        if (!cartToDelete) {return res.status(404).json({message : "cart not found"})}
        let update = await CartModel.updateOne({_id : cid } , { $set : {products : []} } )
        res.status(200).json({update, message : "cart succesfully deleted"})
    } catch(e) {
        console.error("an error occurred while trying to delete the cart : " + e)
        return res.status(500).json({ message: "server error." })
    }
}

// DELETE ONE ELEMENT FROM CART

export const deleteElementFromCart = async (req,res) => {
    try {
        let cid = req.params.cid
        let pid = req.params.pid
        let cart = await CartModel.findById(cid)
        if (!cart) {return res.status(404).json({message : "cart not found"})}
        let index = cart.products.indexOf(product => product.id === pid)
        if (!index) {return res.status(404).json({message: "product not found in cart"})}
        cart.products.splice(index,1)
        cart.save()
        res.status(200).json({message : "product succesfully removed"})
    } catch(e) {
        console.error("an error occurred while trying to delete the cart : " + e)
    }
}

//MODIFY AN ITEM QUANTITY IN THE CART

export const updateCartProductQuantity = async (req,res) => {
    let cid = req.params.cid
    let pid = req.params.pid
    let newQuantity = parseInt(req.body.quantity)
    if (isNaN(newQuantity)) {return res.status(200).json({message : "invalid quantity"})}
    let cartToUpdate = await CartModel.findById(cid)
    if (!cartToUpdate) {return res.status(400).json({message:"cart not found"})}
    console.log(pid)
    let index = cartToUpdate.products.findIndex(product => product._id == pid)
    if (index === -1) {return res.status(404).json({message : "product not found"})}
    cartToUpdate.products[index].quantity = newQuantity
    let updatedCart = await cartToUpdate.save()
    
    return res.status(200).json( {updatedCart})
}