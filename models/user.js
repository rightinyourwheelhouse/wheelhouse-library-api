export function getAllUsers(pool) {
    return pool.query('SELECT * FROM "Library"."Account"');
}

/**
 * Upsert users
 * @param {Connection} pool - the pg pool
 * @param {Array<{id,username,email,avatar}>} users - the users to upsert
 */
export function upsertUsers(pool, users) {
    users.map(user =>
        `
        INSERT INTO  "Library"."Account" as account (id, username, email, avatar)
        VALUES
           (${[user.id, user.username, user.email, user.avatar]
            .map(value => `'${value}'`)
            .join(',')}) 
        ON CONFLICT  ON CONSTRAINT "Account_id_key" 
        DO
        UPDATE
        SET  username = '${user.username}', email = '${user.email}', avatar = '${user.avatar}'
        where account.id = '${user.id}';`
    )
        .forEach(query => pool.query(query))
}
