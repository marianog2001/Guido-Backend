import { Users, Carts, Products, Messages } from '../DAO/factory.js'
import { UserRepository } from './user.repository.js'
import { CartRepository } from './cart.repository.js'
import { ProductRepository } from './product.repository.js'
import { MessageRepository } from './message.repository.js'

export const UserService = new UserRepository( new Users())
export const CartService = new CartRepository(new Carts())
export const ProductService = new ProductRepository(new Products())
export const MessageService = new MessageRepository(new Messages())