const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const app = require('../app');
const Product = require('../models/Product');
const User = require('../models/User');

const { expect } = chai;
chai.use(chaiHttp);

describe('Product API', () => {
  let mongoServer;
  let adminToken;

  before(async () => {
    // Start MongoDB in-memory server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Connect to test DB
    await mongoose.disconnect();
    await mongoose.connect(mongoUri);

    // Create an admin user and generate a token
    const admin = await User.create({
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    adminToken = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'yourSecretKey123',
      { expiresIn: '1h' }
    );
  });

  after(async () => {
    // Clean up
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear Product collection before each test
    await Product.deleteMany({});
  });

  describe('POST /products', () => {
    /*
    it('should create a product with admin access', async () => {
      const productData = {
        name: 'Test Product',
        description: 'A test product',
        price: 29.99,
        images: ['http://example.com/image.jpg'],
        category: 'Test Category',
        stock: 100,
      };

      const res = await chai.request(app)
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message', 'Product added successfully');
      expect(res.body.product).to.have.property('name', 'Test Product');
    });

    it('should not create a product without admin access', async () => {
      const customerToken = jwt.sign(
        { userId: 'customer_id', role: 'customer' },
        process.env.JWT_SECRET || 'yourSecretKey123',
        { expiresIn: '1h' }
      );

      const res = await chai.request(app)
        .post('/products')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          name: 'Test Product',
          description: 'A test product',
          price: 29.99,
          images: ['http://example.com/image.jpg'],
          category: 'Test Category',
          stock: 100,
        });

      expect(res).to.have.status(403);
      expect(res.body).to.have.property('message', 'Forbidden: Access denied');
    });

    it('should return 400 for invalid product data', async () => {
      const res = await chai.request(app)
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: '',
          description: 'Invalid product',
        });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error', 'Error adding product');
    });
    */
  });

  describe('GET /products', () => {
    it('should retrieve all products', async () => {
      await Product.create({
        name: 'Test Product',
        description: 'A test product',
        price: 29.99,
        images: ['http://example.com/image.jpg'],
        category: 'Test Category',
        stock: 100,
      });

      const res = await chai.request(app)
        .get('/products');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('name', 'Test Product');
    });

    it('should return empty array when no products exist', async () => {
      const res = await chai.request(app)
        .get('/products');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(0);
    });
  });
});