import { Users, Carts, Products } from '../DAO/factory.js'
import { UserRepository } from './user.repository.js'
import { CartRepository } from './cart.repository.js'
import { ProductRepository } from './product.repository.js'


export const UserService = new UserRepository( new Users())
export const CartService = new CartRepository(new Carts())
export const ProductService = new ProductRepository(new Products())