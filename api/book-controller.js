import {getAllBooks, getBook, upsertBooks} from "../models/book";
import {generateUUID} from "../util/uuid";
import {bookAlreadyRentedError, bookNotRentedError, rentBook, returnBook} from "../models/rental";

export function books(app, pool) {
    app.get('/api/v1/books',
        async (req, res) => {
            const books = await getAllBooks(pool);
            res.json(books);
        });

    app.post('/api/v1/books',
        async (req, res) => {
            const {ISBN, ownerId} = req.body;
            const id = generateUUID();
            upsertBooks(pool, [{id, ISBN, ownerId}])
                .then(() => getBook(pool, id))
                .then(book => res.json(book))
                .catch(err => res.status(500).send(err.message));
        });

    app.post('/api/v1/books/:id/rent',
        async (req, res) => {
            const bookId = req.params.id;
            rentBook(pool, bookId, req.header('account-id'))
                .then(() => getBook(pool, bookId))
                .then(book => res.json(book))
                .catch(err => err.message === bookAlreadyRentedError
                    ? res.status(403).send(err.message)
                    : res.status(500).send(err.message));
        });


    app.post('/api/v1/books/:id/return',
        async (req, res) => {
            const bookId = req.params.id;
            returnBook(pool, bookId)
                .then(() => getBook(pool, bookId))
                .then(book => res.json(book))
                .catch(err => err.message === bookNotRentedError
                    ? res.status(403).send(err.message)
                    : res.status(500).send(err.message));
        });
}
