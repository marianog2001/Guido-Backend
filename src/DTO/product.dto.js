export default class ProductInsertDTO {
    constructor(product) {
        this.title = product?.title ?? '',
        this.desc = product?.desc ?? '',
        this.price = product?.price ?? 0,
        this.thumbnail = product?.thumbnail ?? [],
        this.code = product?.code ?? '',
        this.category = product?.category ?? '',
        this.stock = product?.stock ?? 0,
        this.status = product?.status ?? false
    }
}