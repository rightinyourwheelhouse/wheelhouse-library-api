import express from 'express';
import { Pool } from 'pg';
import migrate from 'node-pg-migrate';
import cors from 'cors';

import dotenv from 'dotenv';
import { upsertBooks } from './src/models/book';
import { upsertUsers } from './src/models/user';

import { getUsers } from './src/util/slack-users';
import { getBooks } from './src/util/book-seed';
import { bookController } from './src/api/book-controller';
import { rentalController } from './src/api/rental-controller';
import { usersController } from './src/api/user-controller';

dotenv.config();

const corsOptions = {
  origin: 'http://localhost:1234',
};

async function setupDatabase() {
  const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: '',
    port: 54320,
  });
  await migrate({
    dbClient: await pool.connect(),
    dir: './src/migrations',
    direction: 'up'
  });
  return pool;
}

function setupApp(pool) {
  const app = express();

  app.use(express.json());

  app.use(cors(corsOptions));

  app.get('/', (req, res) => res.status(200).send({ message: 'Wheelhouse Library API' }));

  bookController(app, pool);
  rentalController(app, pool);
  usersController(app, pool);
  app.listen(3000);
}

// eslint-disable-next-line no-unused-vars
async function seed(pool) {
  await getUsers().then(users => upsertUsers(pool, users));
  await upsertBooks(pool, getBooks());
}

setupDatabase().then(async (pool) => {
  setupApp(pool);
  // await seed(pool);
  console.log('Running Wheelhouse Library RESTful API @ PORT:3000'); // eslint-disable-line
});
