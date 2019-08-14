/**
 * Upsert users
 * @param {Connection} pool - the pg pool
 * @param {string} tableName - the name of the table to upsert into
 * @param {Array<Object>} inserts - the objects to upsert into the table
 */
export function upsert(inserts, tableName, pool) {
    inserts.map(insert =>
        `INSERT INTO  "Library"."${tableName}" as tbl (${Object.keys(insert).join(', ')})
        VALUES
           (${Object.values(insert).map(value => `'${value}'`).join(', ')}) 
        ON CONFLICT  ON CONSTRAINT "${tableName}_id_key" 
        DO
        UPDATE
        SET  ${Object.entries(insert).map(([key, value]) => `${key}= '${value}'`).join(', ')}
        where tbl.id = '${insert.id}';`
    ).forEach(query => pool.query(query))
}
