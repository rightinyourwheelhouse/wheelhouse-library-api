import {Pool} from "pg";
import {getGoogleBooksMetaData} from "../service/google-books";
import {upsert} from "../util/db-utils";
import {qrify} from "../util/qr";
import {log} from "../util/debug-logger";

function get(pool, id?) {
    let query = `SELECT "Book".*, "Rental".accountId as rentee, "Rental".startDate as rentalStartDate
                    FROM "Library"."Book"
                    LEFT JOIN "Library"."Rental"
                    ON "Rental".bookId = "Book".id`;
    if (id) {
      query = query.concat(`\nWHERE "Book".id = '${id}'`);
    }
    log(`Querying books ${query} \n\t bookId = ${id}`);
    return pool.query(query);
}

export function getAllBooks(pool) {
    log(`Getting all books`);
    return get(pool).then(res => res.rows);
}

export function getBook(pool, bookId) {
    log(`Getting book with id ${JSON.stringify(bookId, null, 4)} `);
    return get(pool, bookId).then(res => (res.rows.length ? res.rows[0] : null));
}

export function upsertBooks(pool: Pool, inserts: Book[]) {
    log(`Upserting books: \n ${JSON.stringify(inserts, null, 4)} `);
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
