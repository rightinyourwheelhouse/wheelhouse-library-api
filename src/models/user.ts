import { upsert } from "../util/db-utils";

export function getAllUsers(pool) {
  return pool.query('SELECT * FROM "Library"."Account"');
}

/**
 * Upsert users
 * @param {any} pool - the pg pool
 * @param {Array<{id,username,avatar}>} users - the users to upsert
 */
export function upsertUsers(pool, users) {
  return upsert(users, 'Account', pool);
}

