import {upsert} from "../util/db-utils";

export function getAllBooks(pool) {
  return pool.query('SELECT * FROM "Library"."Book"');
}

/**
 * Upsert books
 * @param {Connection} pool - the pg pool
 * @param {Array<{id,title,author,ISBN,pages,rating,coverImg,rentalPeriod,ownerId }>} books - the users to upsert
 */
export function upsertBooks(pool, books) {
  upsert(books, 'Book', pool);
}
