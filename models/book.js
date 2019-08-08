export function getAllBooks(pool) {
  return pool.query('SELECT * FROM "Library"."Book"');
}
