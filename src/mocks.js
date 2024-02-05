import { faker } from "@faker-js/faker"

export const generateProductMock = () => {

    let products = []

    for (let i = 0; i < 10; i++) {

        products.push({
            _id:faker.database.mongodbObjectId,
            title: faker.commerce.productName(),
            desc: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            thumbnail: [faker.image.url()],
            code: faker.string.alphanumeric(4),
            category: faker.lorem.word(),
            stock:faker.string.numeric(2),
            stock:faker.datatype.boolean(0.6)
        })

    }
    return {
        docs:products,
        totalDocs:10,
        limit:10,
        totalPages:1,
        page:1,
        pagingCounter:1,
        hasPrevPage:false,
        hasNextPage:false,
        prevPage:null,
        nextPage:null
    }
}
