import {getAllRentals} from "../models/rental";

export function rentals(app, pool) {
    app.get('/api/v1/rentals',
        async (req, res) => {
            const {rows} = await getAllRentals(pool);
            res.json(rows);
        });
}
