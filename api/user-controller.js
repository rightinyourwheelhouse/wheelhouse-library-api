import { getAllUsers } from "../models/user";

export function usersController(app, pool) {
  app.get('/api/v1/users',
    async (req, res) => {
      const { rows } = await getAllUsers(pool);
      await res.json(rows);
    });
}
