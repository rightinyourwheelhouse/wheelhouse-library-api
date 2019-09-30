import {upsert} from "../util/db-utils";

export function getAllUsers(pool) {
    return pool.query('SELECT * FROM "Library"."Account"');
}

/**
 * Upsert users
 * @param {any} pool - the pg pool
 * @param {Array<{id,username,avatar}>} users - the users to upsert
 */
export function upsertUsers(pool, users) {
    return upsert(users, "Account", pool);
}

/**
 * Upsert users
 * @param {any} pool - the pg pool
 * @param {id,username,avatar}>} user - the user to upsert
 */
export function  upsertUser(pool, user) {
    return upsert([user], "Account", pool);
}