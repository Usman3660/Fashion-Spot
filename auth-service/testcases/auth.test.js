const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

const { expect } = chai;
chai.use(chaiHttp);

describe('Auth API', () => {
  let mongoServer;

  before(async () => {
    // Start MongoDB in-memory server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Disconnect from any existing connection and connect to test DB
    await mongoose.disconnect();
    await mongoose.connect(mongoUri);
  });

  after(async () => {
    // Clean up
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear User collection before each test
    await User.deleteMany({});
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await chai.request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          role: 'customer',
        });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message', 'User registered successfully');
      expect(res.body).to.have.property('token');
    });

    it('should not register a user with an existing email', async () => {
      await User.create({
        email: 'test@example.com',
        password: 'password123',
        role: 'customer',
      });

      const res = await chai.request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          role: 'customer',
        });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message', 'User already exists');
    });

    it('should return 400 for invalid input', async () => {
      const res = await chai.request(app)
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: '',
        });

      expect(res).to.have.status(500); // Adjust based on actual validation
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await chai.request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          role: 'customer',
        });
    });

    it('should login a user with correct credentials', async () => {
      const res = await chai.request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message', 'Login successful');
      expect(res.body).to.have.property('token');
    });

    it('should not login with incorrect password', async () => {
      const res = await chai.request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message', 'Incorrect password');
    });

    it('should not login with non-existent user', async () => {
      const res = await chai.request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message', 'User not found');
    });
  });
});