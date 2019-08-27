import {upsert} from "../util/db-utils";

export function getAllBooks(pool) {
    return pool.query(
            `SELECT "Book".*, "Rental".accountId as rentee, "Rental".startDate as rentalStartDate 
                FROM "Library"."Book" 
                LEFT JOIN "Library"."Rental" 
                ON "Rental".bookId = "Book".id`);
}

/**
 * Upsert books
 * @param {Connection} pool - the pg pool
 * @param {Array<{id,title,author,ISBN,pages,rating,coverImg,rentalPeriod,ownerId }>} books - the users to upsert
 */
export function upsertBooks(pool, books) {
    upsert(books, 'Book', pool);
}
