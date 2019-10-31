import request from "request-promise";

export function getGoogleBooksMetaData(book) {
    return request({
        uri: `https://www.googleapis.com/books/v1/volumes?q=+isbn:${book.ISBN}&key=${process.env.GOOGLE_API_KEY}`,
        json: true,
    }).then((googleBooks) => googleBooks.items ? googleBooks.items[0].volumeInfo : null);
}
