import {Pool} from "pg";
import {bookAlreadyRentedError, bookNotRentedError} from "../util/error-msg";

export function getAllRentals(pool) {
    return pool.query('SELECT * FROM "Library"."Rental"');
}

export function getRentalsForBook(pool, bookId) {
    return pool.query(`SELECT * FROM "Library"."Rental" WHERE bookId = '${bookId}'`);
}

export function getRentalsForAccount(pool, accountId) {
    return pool.query(`SELECT * FROM "Library"."Rental" WHERE accountId = '${accountId}'`);
}

export function rentBook(pool: Pool, bookId, accountId) {
    return getRentalsForBook(pool, bookId)
        .then(rentals => {
            if (rentals.rows.length > 0) {
                throw new Error(bookAlreadyRentedError);
            }
            return pool.query(`INSERT INTO  "Library"."Rental" (bookId, accountId)
                                                VALUES ('${bookId}', '${accountId}')`);
        });
}

export function returnBook(pool: Pool, bookId) {
    return getRentalsForBook(pool, bookId)
        .then(rentals => {
            if (rentals.rows.length <= 0) {
                throw new Error(bookNotRentedError);
            }
            return pool.query(`DELETE FROM "Library"."Rental" WHERE bookId = '${bookId}'`);
        });
}
