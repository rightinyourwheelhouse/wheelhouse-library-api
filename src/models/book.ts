import {Pool} from "pg";
import request from "request-promise";
import {upsert} from "../util/db-utils";
import {qrify} from "../util/qr";

function get(pool, id?) {
    const query = `SELECT "Book".*, "Rental".accountId as rentee, "Rental".startDate as rentalStartDate
                    FROM "Library"."Book"
                    LEFT JOIN "Library"."Rental"
                    ON "Rental".bookId = "Book".id`;
    if (id) {
        query.concat(`WHERE "Book".id = ${id}'`);
    }
    return pool.query(query);
}

export function getAllBooks(pool) {
    return get(pool).then(res => res.rows);
}

export function getBook(pool, bookId) {
    return get(pool, bookId).then(res => (res.rows.length ? res.rows[0] : null));
}

export function upsertBooks(pool: Pool, inserts: Book[]) {
    return Promise.all(inserts.map(
        book => request({
            uri: `https://www.googleapis.com/books/v1/volumes?q=+isbn:${book.ISBN}`,
            json: true,
        }).then(async (googleBooks) => {
            if (googleBooks.items) {
                const QRCode = await qrify(book.id);
                const metadata = googleBooks.items[0].volumeInfo;
                return {
                    ...book,
                    title: (metadata.subtitle
                        ? `${metadata.title}: ${metadata.subtitle}`
                        : metadata.title).replace("'", "''"),
                    author: metadata.authors.join(", ").replace("'", "''"),
                    pages: metadata.pageCount,
                    coverImg: metadata.imageLinks.thumbnail,
                    QRCode,
                };
            }
        }),
    )).then(books => upsert(books, "Book", pool));
}

export interface Book {
    id: string;
    ISBN: string;
    ownerId: string;
}
