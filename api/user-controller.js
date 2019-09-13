import {getAllUsers} from "../models/user";

export function users(app, pool) {
    app.get('/api/v1/users',
        async (req, res) => {
            const {rows} = await getAllUsers(pool);
            res.json(rows);
        });
}
