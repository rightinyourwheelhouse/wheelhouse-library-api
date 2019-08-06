import express from 'express';
import path from 'path';

const app = express();

// Enable JSON request body
app.use(express.json());

// Expose assets
app.use('/static', express.static(path.join(__dirname, 'public')));

// Endpoints
app.get('/', (req, res) => res.status(200).send({ message: 'YAY! Congratulations! Your first endpoint is working' }));

// Listen on port 3000
app.listen(3000);
console.log('Running Wheelhouse Library RESTful API @ PORT:3000'); // eslint-disable-line
