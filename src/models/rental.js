export const bookAlreadyRentedError = 'Book already rented';
export const bookNotRentedError = 'Book is not rented';

export function getAllRentals(pool) {
  return pool.query('SELECT * FROM "Library"."Rental"');
}

export function getRentalsForBook(pool, bookId) {
  return pool.query(`SELECT * FROM "Library"."Rental" WHERE bookId = '${bookId}'`);
}

export function getRentalsForAccount(pool, accountId) {
  return pool.query(`SELECT * FROM "Library"."Rental" WHERE accountId = '${accountId}'`);
}

/**
 * Rent book
 * @param {any} pool - the pg pool
 * @param bookId {string} - book ID
 * @param accountId {string} - user ID
 */
export function rentBook(pool, bookId, accountId) {
  return getRentalsForBook(pool, bookId)
  .then(rentals => {
    if (rentals.rows.length > 0) {
      throw new Error(bookAlreadyRentedError);
    }
    return pool.query(`INSERT INTO  "Library"."Rental" (bookId, accountId) VALUES ('${bookId}', '${accountId}')`);
  });
}

/**
 * Return book
 * @param {any} pool - the pg pool
 * @param bookId {string} - book ID
 */
export function returnBook(pool, bookId) {
  return getRentalsForBook(pool, bookId)
  .then(rentals => {
    if (rentals.rows.length <= 0) {
      throw new Error(bookNotRentedError);
    }
    return pool.query(`DELETE FROM "Library"."Rental" WHERE bookId = '${bookId}'`);
  });
}
