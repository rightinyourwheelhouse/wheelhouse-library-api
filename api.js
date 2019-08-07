import express from 'express';
import path from 'path';
import { Pool } from 'pg';

const app = express();
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'WheelhouseLibrary',
  password: '',
  port: 54320,
});

const getBooks = () => pool.query('SELECT * FROM "Library"."Book"');

// Enable JSON request body
app.use(express.json());

// Expose assets
app.use('/static', express.static(path.join(__dirname, 'public')));

// Endpoints
app.get('/', (req, res) => res.status(200).send({ message: 'Wheelhouse Library API' }));

app.get('/api/v1/books', async (req, res) => {
  const books = await getBooks();

  console.log(books);
  res.json({
    status: 'ok',
  });
});

// Listen on port 3000
app.listen(3000);
console.log('Running Wheelhouse Library RESTful API @ PORT:3000'); // eslint-disable-line
