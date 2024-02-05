export const generateUserErrorInfo = (user) => {
    return `
    Uno o mas propiedades estan incompletas o son invalidas
    Lista de propiedades obligatorias:
    -first_name: Debe ser string (${user?.first_name})
    -last_name: Debe ser string (${user?.last_name})
    -email: Debe ser string (${user?.email})
    `
}