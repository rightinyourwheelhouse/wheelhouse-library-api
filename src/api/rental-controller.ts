import {getAllRentals} from "../models/rental";

export function rentalController(app, pool) {
    app.get("/api/v1/rentals",
        async (req, res) => {
            const {rows} = await getAllRentals(pool);
            await res.json(rows);
        });
}
