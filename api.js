import express from 'express';
import path from 'path';
import {Pool} from 'pg';
import cors from 'cors';

import {getAllBooks} from './models/book';

import dotenv from 'dotenv';
dotenv.config();

const corsOptions = {
    origin: 'http://localhost:1234',
};

const app = express();

// Make a pool-based connection to Postgres
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'WheelhouseLibrary',
    password: '',
    port: 54320,
});

// Enable JSON request body usage
app.use(express.json());

// CORS allow options
app.options('*', cors());

// Expose assets from public folder
app.use('/static', express.static(path.join(__dirname, 'public')));

// ---------
// Endpoints
// ---------
app.get('/',
    (req, res) => res.status(200).send({message: 'Wheelhouse Library API'}));

// Get all books
app.get('/api/v1/books',
    async (req, res) => {
        const {rows} = await getAllBooks(pool);
        res.json(rows);
    });

// Authorize via Slack
app.get('/auth', cors(), (req, res) => {
    console.log(req.body);
    res.status(200).send();
});

// Listen on port 3000
app.listen(3000);
console.log('Running Wheelhouse Library RESTful API @ PORT:3000'); // eslint-disable-line
