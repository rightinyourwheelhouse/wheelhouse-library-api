/**
 * Upsert users
 * @param {{id: string}} insert - the objects to upsert into the table
 * @return {any | {id: string}} insert - the objects to upsert into the table
 */
import {Pool, QueryResult} from "pg";

function filterEmptyValues(insert): any {
    return Object.entries(insert)
        .reduce((object, [key, value]) => (value
            ? Object.assign(object, {[key]: value})
            : object), {});
}

/**
 * Upsert users
 * @param {any} pool - the pg pool
 * @param {string} tableName - the name of the table to upsert into
 * @param {Array<{id: string}>} inserts - the objects to upsert into the table
 */
export function upsert(inserts, tableName, pool: Pool): Promise<QueryResult[]> {
    return Promise.all<QueryResult>(
        inserts
            .filter(insert => insert)
            .map(insert => filterEmptyValues(insert))
            .map(insert => `INSERT INTO "Library"."${tableName}" as tbl (${Object.keys(insert).join(", ")})
                            VALUES
                               (${Object.values(insert).map(value => `'${value}'`).join(", ")})
                            ON CONFLICT ON CONSTRAINT "${tableName}_id_key"
                            DO
                            UPDATE
                            SET  ${Object.entries(insert).map(([key, value]) => `${key}= '${value}'`).join(", ")}
                            where tbl.id = '${insert.id}';`)
            .map((query: string) => pool.query(query)),
    );
}
