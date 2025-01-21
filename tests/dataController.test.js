//dataController.test.js
const request = require('supertest');
const {app} = require('../index'); // Adjust this path to point to your Express app
const {sequelize, Book, User, ReadingList } = require('../models')
require('dotenv').config();


describe('API Endpoints', () => {
  describe('POST /api/users', () => {
    it('should create a user with valid data', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ "username": "TestUser1", "email": "test1@example.com" });
      expect(res.statusCode).toBe(201);
      expect(res.body.user).toHaveProperty('id');
    });

    it('should not create a user with an existing email', async () => {
      await request(app)
        .post('/api/users')
        .send({ username: 'TestUser2', email: 'test@example.com' });
      const res = await request(app)
        .post('/api/users')
        .send({ username: 'AnotherUser', email: 'test@example.com' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('email already exists!');
    });
  });

  describe('POST /api/books', () => {
    it('should add a book with valid data', async () => {
      const res = await request(app)
        .post('/api/books')
        .send({
          title: 'Book Title',
          author: 'Book Author',
          genre: 'Fiction',
          publicationYear: 2020,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.book).toHaveProperty('id');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/books')
        .send({ title: 'Incomplete Book' });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toContain('author is required!');
    });
  });

  describe('GET /api/books/search', () => {
    it('should fetch books by title and author', async () => {
      await request(app).post('/api/books').send({
        title: 'Search Book',
        author: 'Search Author',
        genre: 'Drama',
        publicationYear: 2021,
      });
      const res = await request(app).get(
        '/api/books/search?title=Search Book&author=Search Author'
      );
      expect(res.statusCode).toBe(200);
      
    });

    it('should return 404 if no books are found', async () => {
      const res = await request(app).get(
        '/api/books/search?title=NonExistent&author=Unknown'
      );
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('No books found');
    });
  });

  describe('POST /api/reading-list', () => {
    it('should add a book to the reading list', async () => {
      const user = await User.create({ username: 'Reader', email: 'reader@example.com' });
      const book = await Book.create({
        title: 'Reading List Book',
        author: 'Author',
        genre: 'Non-Fiction',
        publicationYear: 2019,
      });
      const res = await request(app)
        .post('/api/reading-list')
        .send({ userId: user.id, bookId: book.id, status: 'Reading' });
      expect(res.statusCode).toBe(200);
      expect(res.body.readingList).toHaveProperty('id');
    });

    it('should return 400 for invalid user or book ID', async () => {
      const res = await request(app)
        .post('/api/reading-list')
        .send({ userId: 999, bookId: 999, status: 'Reading' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid user or book ID!');
    });
  });

  describe('PUT /api/books/:bookId', () => {
    it('should update book details', async () => {
      const book = await Book.create({
        title: 'Old Title',
        author: 'Author',
        genre: 'Genre',
        publicationYear: 2018,
      });
      const res = await request(app)
        .post(`/api/books/${book.id}`)
        .send({ title: 'Updated Title', genre: 'Updated Genre' });
      expect(res.statusCode).toBe(200);
      expect(res.body.book.title).toBe('Updated Title');
    });

    it('should return 404 if the book is not found', async () => {
      const res = await request(app).post('/api/books/999').send({
        title: 'Nonexistent Book',
        genre: 'Nonexistent Genre',
      });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Book not found!');
    });
  });

  describe('GET /api/reading-list/:userId', () => {
    it('should fetch a user’s reading list', async () => {
      const user = await User.create({ username: 'ListUser', email: 'listuser@example.com' });
      const book = await Book.create({
        title: 'List Book',
        author: 'Author',
        genre: 'Genre',
        publicationYear: 2022,
      });
      await ReadingList.create({ userId: user.id, bookId: book.id, status: 'Completed' });
      const res = await request(app).get(`/api/reading-list/13`);
      expect(res.statusCode).toBe(200);

    });

    it('should return 404 if no reading list is found', async () => {
      const res = await request(app).get('/api/reading-list/999');
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('User not found or no books in reading list');
    });
  });

  describe('DELETE /api/reading-list/:readingListId', () => {
    it('should remove a book from the reading list', async () => {
      const readingList = await ReadingList.create({
        userId: 13,
        bookId: 21,
        status: 'Reading',
      });
      const res = await request(app).post(
        `/api/reading-list/${readingList.id}`
      );
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Book removed from reading list!');
    });
  });
});
