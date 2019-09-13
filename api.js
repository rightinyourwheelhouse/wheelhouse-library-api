import express from 'express';
import {Pool} from 'pg';
import migrate from 'node-pg-migrate';
import cors from 'cors';

import dotenv from 'dotenv';
import {upsertBooks} from './models/book';
import {upsertUsers} from './models/user';

import {getUsers} from './util/slack_users';
import {getBooks} from "./util/book-seed";
import {books} from "./api/book-controller";
import {rentals} from "./api/rental-controller";
import {users} from "./api/user-controller";

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
    const dbClient = await pool.connect();
    await migrate({dbClient, dir: './migrations', direction: "up"});
    return pool;
}

function setupApp(pool) {
    const app = express();

    app.use(express.json());

    app.use(cors(corsOptions));

    app.get('/', (req, res) => res.status(200).send({message: 'Wheelhouse Library API'}));

    books(app, pool);
    rentals(app, pool);
    users(app, pool);
    app.listen(3000);
}

setupDatabase()
    .then(async pool => {
        setupApp(pool);
        await getUsers().then((users) => upsertUsers(pool, users));
        await upsertBooks(pool, getBooks());
        console.log('Running Wheelhouse Library RESTful API @ PORT:3000'); // eslint-disable-line

    });
