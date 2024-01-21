/* eslint-disable no-case-declarations */

import { persistence, url, dbName } from '../environment.js'
import mongoose from 'mongoose'

export let Products, Carts, Users, Messages, Tickets

console.log('Persistence using: ' + persistence)

switch (persistence) {
case 'MONGO':

    await mongoose.connect(url, { dbName })
        .then(() => {
            console.log('DATABASE connected succesfully')
        })
        .catch(
            (error) => {
                console.error('error connecting to db: ' + error)
            }
        )
    const { default: ProductsMongo } = await import('./mongo/controller/products.controller.js')
    const { default: CartsMongo } = await import('./mongo/controller/cart.controller.js')
    const { default: UsersMongo } = await import('./mongo/controller/user.controller.js')
    const { default: MessagesMongo } = await import('./mongo/controller/message.controller.js')
    const { default: TicketsMongo } = await import('./mongo/controller/ticket.controller.js')
    Messages = MessagesMongo
    Products = ProductsMongo
    Carts = CartsMongo
    Users = UsersMongo
    Tickets = TicketsMongo
    break

case 'FILE':
    const { default: ProductsFile } = await import('./file/controller/products.controller.js')
    const { default: CartsFile } = await import('./file/controller/cart.controller.js')
    const { default: UsersFile } = await import('./file/controller/user.controller.js')
    Products = ProductsFile
    Carts = CartsFile
    Users = UsersFile
    break

case 'MEMORY':
    const { default: ProductsMemory } = await import('./memory/controller/products.controller.js')
    const { default: CartsMemory } = await import('./memory/controller/cart.controller.js')
    const { default: UsersMemory } = await import('./memory/controller/user.controller.js')
    Products = ProductsMemory
    Carts = CartsMemory
    Users = UsersMemory
    break

default:
    throw new Error('Persistence not found')
}
