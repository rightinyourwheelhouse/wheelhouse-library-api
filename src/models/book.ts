import {Pool} from "pg";
import {getGoogleBooksMetaData} from "../service/google-books";
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
        book => getGoogleBooksMetaData(book).then(async (metadata) => {
            if (metadata) {
                const QRCode = await qrify(book.id);
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
