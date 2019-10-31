export const bookAlreadyRentedError = "Book already rented";
export const bookNotRentedError = "Book is not rented";

export function createInvalidPropertyError(property) {
    return `Please provide a valid ${property}`;
}
