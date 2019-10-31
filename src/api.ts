import cors from "cors";
import express from "express";
import migrate from "node-pg-migrate";
import passport from "passport";
import { Strategy as SlackStrategy } from "passport-slack";
import { Client, Pool } from "pg";

import { upsertBooks } from "./models/book";
import { upsertUser, upsertUsers } from "./models/user";

import { bookController } from "./api/book-controller";
import { loginController } from "./api/login-controller";
import { rentalController } from "./api/rental-controller";
import { usersController } from "./api/user-controller";

import { getBooks } from "./util/book-seed";
import { checkEnvVars } from "./util/env-validation";
import { getUsers } from "./util/slack-users";

const pgConfig = {
    user: "postgres",
    host: "postgres",
    database: "postgres",
    password: "",
    port: 5432,
};

const corsOptions = {
    origin: "http://localhost:1234",
};

checkEnvVars(process.env);

const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_CALLBACK_URL } = process.env;

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

    // setup the strategy using defaults
    passport.use(new SlackStrategy({
        clientID: SLACK_CLIENT_ID,
        clientSecret: SLACK_CLIENT_SECRET,
        callbackURL: SLACK_CALLBACK_URL,
    }, async (accessToken, refreshToken, profile, done) => {
        await upsertUser(pool, {
            id: profile.user.id,
            avatar: profile.user.image_512,
            username: profile.user.name,
        });
        done(null, profile);
    }));

    app.use(express.json());
    app.use(cors(corsOptions));

    app.get("/", (req, res) =>
        res.status(200).send({message: "Wheelhouse Library API"}));

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
    await seed(pool);
    // tslint:disable-next-line:no-console
    console.log("Running Wheelhouse Library RESTful API @ PORT:3000");
});
