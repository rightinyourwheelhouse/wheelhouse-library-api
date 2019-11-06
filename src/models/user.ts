import {upsert} from "../util/db-utils";
import {log} from "../util/debug-logger";

export function getAllUsers(pool) {
    log(`Getting all users`);
    return pool.query('SELECT * FROM "Library"."Account"');
}

export function getUser(pool, id) {
    log(`Getting user with id ${id}`);
    return pool.query(`SELECT * FROM "Library"."Account" WHERE "Account".id = '${id}'`);
}

/**
 * Upsert users
 * @param {any} pool - the pg pool
 * @param {Array<{id,username,avatar}>} users - the users to upsert
 */
export function upsertUsers(pool, users) {
    log(`Upserting user ${JSON.stringify(users, null, 4)} `);
    return upsert(users, "Account", pool);
}

export function upsertUser(pool, user: User) {
    log(`Upserting user ${JSON.stringify(user, null, 4)} `);
    return upsert([user], "Account", pool);
}

export interface User {
    id: string;
    username: string;
    avatar: string;
}
