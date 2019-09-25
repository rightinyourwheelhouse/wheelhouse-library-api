import request from 'request-promise';
import { upsert } from '../util/db-utils';

function get(pool, id) {
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

/**
 * Upsert books
 * @param {any} pool - the pg pool
 * @param {Array<{id,ISBN,ownerId }>} books - the users to upsert
 */
export function upsertBooks(pool, books) {
  return Promise.all(books.map(
    book => request({
      uri: `https://www.googleapis.com/books/v1/volumes?q=+isbn:${book.ISBN}`,
      json: true,
    }).then((books) => {
      if (books.items) {
        const metadata = books.items[0].volumeInfo;
        return {
          ...book,
          title: (metadata.subtitle
            ? `${metadata.title}: ${metadata.subtitle}`
            : metadata.title).replace('\'', '\'\''),
          author: metadata.authors.join(', ').replace('\'', '\'\''),
          pages: metadata.pageCount,
          coverImg: metadata.imageLinks.thumbnail,
        };
      }
    }),
  )).then(books => upsert(books, 'Book', pool));
}
