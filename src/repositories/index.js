import { Users, Carts, Products, Messages, Tickets } from '../DAO/factory.js'
import { UserRepository } from './user.repository.js'
import { CartRepository } from './cart.repository.js'
import { ProductRepository } from './product.repository.js'
import { MessageRepository } from './message.repository.js'
import { TicketRepository } from './ticket.repository.js'

export const UserService = new UserRepository( new Users())
export const CartService = new CartRepository(new Carts())
export const ProductService = new ProductRepository(new Products())
export const MessageService = new MessageRepository(new Messages())
export const TicketService = new TicketRepository(new Tickets())