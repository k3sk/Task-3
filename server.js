// grabbing express cuz we're not trying to build everything from scratch, iykyk 💅
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// enabling CORS because we don't gatekeep in this house 💁‍♀️
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
let books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' }, // the OG party king
    { id: 2, title: '1984', author: 'George Orwell' } // lowkey dystopian vibes
];

// spilling the tea on all our books - GET route be like "here's the whole library bestie" 
app.get('/books', (req, res) => {
    res.json(books); // sending that book list faster than gossip spreads
});

// GET /books/:id - Return a specific book
app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
});

// this is where we make new (books) join our collection
app.post('/books', (req, res) => {
    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).json({ message: 'Title and author are required' });
    }

    const newBook = {
        id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
        title,
        author
    };

    books.push(newBook);
    res.status(201).json(newBook);
});

// PUT /books/:id - Update a book
app.put('/books/:id', (req, res) => {
    const { title, author } = req.body;
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Book not found' });
    }

    if (!title && !author) {
        return res.status(400).json({ message: 'Title or author is required' });
    }

    books[bookIndex] = {
        ...books[bookIndex],
        title: title || books[bookIndex].title,
        author: author || books[bookIndex].author
    };

    res.json(books[bookIndex]);
});

// yeet a book from the collection - DELETE route doing its thing 🗑️
app.delete('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Book not found' });
    }

    books.splice(bookIndex, 1);
    res.status(204).send();
});

// time to make this server pop off! 
const PORT = 3000; 
app.listen(PORT, () => {
    console.log(`Server is slaying on http://localhost:${PORT} ✨`);
});