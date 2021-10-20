const request = require('supertest');
const app = require('../src/app');
const {
  connectDB,
  eraseDB
} = require('../src/db')

const { NODE_ENV } = process.env;

let db;

beforeAll(async () => {
  db = await connectDB();
});

afterEach(async () => {
  await eraseDB(db);
});

describe('Main API Test', () => {
  it('Root route', async () => {
    const res = await request(app).get('/')
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(`Sensors Data API is running on ${NODE_ENV}`);
  })
});