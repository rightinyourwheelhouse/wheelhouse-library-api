import cors from "cors";
import express from "express";
import passport from 'passport';
import { Strategy as SlackStrategy } from "passport-slack";
import migrate from "node-pg-migrate";
import { Client, Pool } from "pg";

import dotenv from "dotenv";
import { upsertBooks } from "./models/book";
import { upsertUsers } from "./models/user";

import { bookController } from "./api/book-controller";
import { rentalController } from "./api/rental-controller";
import { usersController } from "./api/user-controller";
import {loginController} from "./api/login-controller";

import { getBooks } from "./util/book-seed";
import { getUsers } from "./util/slack-users";

dotenv.config();

const pgConfig = {
    user: "postgres",
    host: "127.0.0.1",
    database: "postgres",
    password: "",
    port: 54320,
};

const corsOptions = {
    origin: "http://localhost:1234",
};
const { CLIENT_ID, CLIENT_SECRET } = process.env;

// setup the strategy using defaults
passport.use(new SlackStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/slack/callback"
}, (accessToken, refreshToken, profile, done) => {
    // optionally persist profile data
    console.log("PROfILE", profile)
    done(null, profile);
}));

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
    // client.release();
    return pool;
}

function setupApp(pool) {
    const app = express();

    app.use(express.json());
    app.use(cors(corsOptions));
    app.use(passport.initialize());
    
    app.get("/", (req, res) => res.status(200).send({ message: "Wheelhouse Library API" }));
    
    loginController(app, passport);
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
    // tslint:disable-next-line:no-console
    console.log("Running Wheelhouse Library RESTful API @ PORT:3000");
});
