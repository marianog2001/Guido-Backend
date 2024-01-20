export default class UserInsertDTO {
    constructor(user) {
        this.first_name = user?.first_name ?? ''
        this.last_name = user?.last_name ?? ''
        this.email = user.email //required
        this.age = user?.age ?? 0
        this.password = user.password //required
        this.rol = user?.role ?? 'user'
        this.cartId = user?.cartId ?? ''
    }
}