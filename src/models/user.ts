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

export function upsertUser(pool, user: User) {
    return upsert([user], "Account", pool);
}

export interface User {
    id: string;
    username: string;
    avatar: string;
}
