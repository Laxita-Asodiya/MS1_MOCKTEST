//dataController.test.js
const request = require('supertest');
const {app} = require('../index'); 
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

});
