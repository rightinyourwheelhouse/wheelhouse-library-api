import cors from "cors";
import express from "express";
import session from "express-session";
import migrate from "node-pg-migrate";
import passport from "passport";
import { Strategy as SlackStrategy } from "passport-slack";
import { Client, Pool } from "pg";

import dotenv from "dotenv";
import { upsertBooks } from "./models/book";
import { upsertUsers } from "./models/user";

import { bookController } from "./api/book-controller";
import { loginController } from "./api/login-controller";
import { rentalController } from "./api/rental-controller";
import { usersController } from "./api/user-controller";

import { getBooks } from "./util/book-seed";
import { getUsers } from "./util/slack-users";

dotenv.config();

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
const { CLIENT_ID, CLIENT_SECRET, BASE_URL } = process.env;

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
// used to serialize the user for the session
passport.serializeUser((user, done) => {
    done(null, user.id);
   // where is this user.id going? Are we supposed to access this anywhere?
});

function setupApp(pool) {
    const app = express();
    app.use(session({
        secret: "test",
        resave: false,
        saveUninitialized: true,
    }));
    // setup the strategy using defaults
    passport.use(new SlackStrategy({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: `${BASE_URL}/auth/slack/callback`,
    }, (accessToken, refreshToken, profile, done) => {
        // TODO: user the pool to upsert the user based on the profile.
        // TODO: put user in session
        // console.log("user profile: " + profile);
        done(null, profile);
    }));

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
