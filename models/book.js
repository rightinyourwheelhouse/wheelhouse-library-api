import {upsert} from "../util/db-utils";

function get(pool, id) {
    const query = `SELECT "Book".*, "Rental".accountId as rentee, "Rental".startDate as rentalStartDate 
            FROM "Library"."Book" 
            LEFT JOIN "Library"."Rental" 
            ON "Rental".bookId = "Book".id`;
    if (id) {
        query.concat(`WHERE "Book".id = ${id}'`)
    }
    return pool.query(query);
}

export function getAllBooks(pool) {
    return get(pool).then(res => res.rows);
}

export function getBook(pool, bookId) {
    return get(pool, bookId).then(res => res.rows.length ? res.rows[0] : null);
}

/**
 * Upsert books
 * @param {Connection} pool - the pg pool
 * @param {Array<{id,title,author,ISBN,pages,rating,coverImg,rentalPeriod,ownerId }>} books - the users to upsert
 */
export function upsertBooks(pool, books) {
    return upsert(books, 'Book', pool);
}
