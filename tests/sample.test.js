const request = require('supertest');
const app = require('../src/index');
const {
  connectDB,
  eraseDB
} = require('../src/db')

let db;

beforeAll(async () => {
  db = await connectDB();
});

afterEach(async () => {
  await eraseDB(db);
});

describe('Sample Test', () => {
  it('App is defined', (done) => {
    expect(app).toBeDefined();
    done();
  });
});

