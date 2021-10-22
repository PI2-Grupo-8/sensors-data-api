const request = require('supertest');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const {
  connectDB,
  eraseDB
} = require('../src/db')

const SENSOR_DATA_TYPES = require('../src/utils/sensorDataTypes')

const { SECRET } = process.env;

let db;

beforeAll(async () => {
  db = await connectDB();
});

afterEach(async () => {
  await eraseDB(db);
});

describe('Graphs Test', () => {
  const vehicleID = '6160b2c10b78bd90eb221a06'

  const data1 = {
    type: SENSOR_DATA_TYPES[0],
    value: 1
  }
  const data2 = {
    type: SENSOR_DATA_TYPES[0],
    value: 2
  }
  const data3 = {
    type: SENSOR_DATA_TYPES[0],
    value: 3
  }

  const token = jwt.sign({
    _id: '6170e1900c5f53f7116322b0',
    name: 'user',
    email: 'user@email.com',
    password: '123'
  }, SECRET, {
    expiresIn: 240,
  });

  beforeEach(async () => {
    const r1 = await request(app).post(`/data/${vehicleID}`).send(data1)
      .set('authorization', `JWT ${token}`);
    data1.createdAt = r1.body.createdAt
    const r2 = await request(app).post(`/data/${vehicleID}`).send(data2)
      .set('authorization', `JWT ${token}`);
    data2.createdAt = r2.body.createdAt
    const r3 = await request(app).post(`/data/${vehicleID}`).send(data3)
      .set('authorization', `JWT ${token}`);
    data3.createdAt = r3.body.createdAt
  });

  it('gets fertilizer graph', async () => {
    const graph = [
      { y: data3.value, x: data3.createdAt},
      { y: data2.value, x: data2.createdAt},
      { y: data1.value, x: data1.createdAt},
    ]
    const res = await request(app).get(`/data/graph/${vehicleID}/${SENSOR_DATA_TYPES[0]}`)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual(graph);
  })

  it('gets fertilizer graph on week mode', async () => {
    const graph = [
      { y: data3.value, x: data3.createdAt},
      { y: data2.value, x: data2.createdAt},
      { y: data1.value, x: data1.createdAt},
    ]
    const res = await request(app).get(`/data/graph/${vehicleID}/${SENSOR_DATA_TYPES[0]}/?period=week`)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual(graph);
  })

  it('gets error on getting graph', async () => {
    const graph = [
      { y: data3.value, x: data3.createdAt},
      { y: data2.value, x: data2.createdAt},
      { y: data1.value, x: data1.createdAt},
    ]
    const res = await request(app).get(`/data/graph/123/123`)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toStrictEqual('Could not get graph');
  });

  it('runs more then 25 points', async () => {

    for (let index = 0; index < 100; index++) {
      const data = {
        type: SENSOR_DATA_TYPES[0],
        value: Math.floor(Math.random() * (100 - 0 + 1) + 100)
      }
      await request(app).post(`/data/${vehicleID}`).send(data)
        .set('authorization', `JWT ${token}`);
    }
    const res = await request(app).get(`/data/graph/${vehicleID}/${SENSOR_DATA_TYPES[0]}`)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(26);
  })
});