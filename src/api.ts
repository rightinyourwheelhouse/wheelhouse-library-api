import cors from "cors";
import express from "express";
import migrate from "node-pg-migrate";
import {Client, Pool} from "pg";

import {upsertBooks} from "./models/book";
import {upsertUsers} from "./models/user";

import {bookController} from "./api/book-controller";
import {loginController} from "./api/login-controller";
import {rentalController} from "./api/rental-controller";
import {usersController} from "./api/user-controller";

import {getBooks} from "./util/book-seed";
import {checkEnvVars} from "./util/env-validation";
import {getUsers} from "./util/slack-users";

checkEnvVars(process.env);

const pgConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: !process.env.DATABASE_NO_SSL,
};

const whitelist = [
  "https://whla-app.herokuapp.com",
  "http://localhost:3000", // new dev with react-create-app
  "http://localhost:1234", // old dev with parcel-bundler
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS violation: Origin ${origin} is not allowed!`));
    }
  },
};

async function setupDatabase() {
    const pool = new Pool(pgConfig);
    const client = await pool.connect();
    await migrate({
        dbClient: client as unknown as Client,
        dir: "./migrations",
        direction: "up",
        migrationsTable: "migrations",
        count: undefined,
        ignorePattern: "",

    });
    return pool;
}

function setupApp(pool) {
    const app = express();

    app.use(express.json());
    app.use(cors(corsOptions));

    app.get("/", (req, res) =>
        res.status(200).send({message: "Wheelhouse Library API"}));

    loginController(app, pool);
    bookController(app, pool);
    rentalController(app, pool);
    usersController(app, pool);

    app.listen(process.env.PORT || 3000);
}

// eslint-disable-next-line no-unused-vars
async function seed(pool) {
    await getUsers().then(users => upsertUsers(pool, users));
    await upsertBooks(pool, getBooks());
}

setupDatabase().then(async (pool) => {
    setupApp(pool);
    await seed(pool);
    // tslint:disable-next-line:no-console
    console.log(`Running Wheelhouse Library RESTful API @ PORT: ${process.env.PORT || 3000}`);
});
