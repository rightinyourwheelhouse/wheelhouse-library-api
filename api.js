import express from 'express';

const app = express();

// Enable JSON request body
app.use(express.json());

// Endpoints
app.get('/', (req, res) => res.status(200).send({ message: 'YAY! Congratulations! Your first endpoint is working' }));

// Listen on port 3000
app.listen(3000);
console.log('Running Wheelhouse Library RESTful API @ PORT:3000'); // eslint-disable-line
