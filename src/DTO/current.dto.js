// same as user but without returning password and, eventually, won't return pay methods as well

export default class CurrentInsertDTO {
    constructor(user) {
        this.first_name = user?.first_name ?? ''
        this.last_name = user?.last_name ?? ''
        this.email = user.email //required
        this.age = user?.age ?? 0
        this.rol = user.rol //required
        this.cartId = user?.cartId ?? ''
    }
}