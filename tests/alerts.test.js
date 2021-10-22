const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const {
  connectDB,
  eraseDB
} = require('../src/db')

const ALERT_TYPES = require('../src/utils/alertTypes')

const { SECRET } = process.env;

let db;

beforeAll(async () => {
  db = await connectDB();
});

afterEach(async () => {
  await eraseDB(db);
});

describe('Alert Tests', () => {
  let alertID;
  let createdAlert;

  let alert = {
    vehicle: "61411790de1c603fc8596ea9",
    type: "low_fertilizer"
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
    const res = await request(app).post('/alert/create').send(alert)
      .set('authorization', `JWT ${token}`);

     alertID = res.body._id;
    createdAlert = res.body
  });

  it('Creates an alert', async () => {
    let newAlert = {
      owner: "61411b17b45f264f37ca89e3",
      type: "low_battery"
    }
    const res = await request(app).post('/alert/create').send(newAlert)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicle).toBe(newAlert.vehicle);
    expect(res.body.type).toBe(newAlert.type);
  });

  it('Finds a alert by ID', async () => {
    const res = await request(app).get(`/alert/${alertID}`)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicle).toBe(alert.vehicle);
    expect(res.body.type).toBe(alert.type);
  });

  it('Receives error on finding alert', async () => {
    const res = await request(app).get('/alert/123')
      .set('authorization', `JWT ${token}`);
    expect(res.statusCode).toBe(400);
  });

  describe('Find alerts by vehicle', () => {
    let closedAlertID;
    let closedAlert;
    let vehicleID = alert.vehicle;

    let alert2 = {
      vehicle: vehicleID,
      type: "stuck_vehicle"
    }

    let alert3 = {
      vehicle: "614b550571251f4b8f22761d",
      type: "low_fertilizer"
    }

    beforeEach(async () => {
      const res = await request(app).post('/alert/create').send(alert2)
        .set('authorization', `JWT ${token}`);
      closedAlertID = res.body._id;

      const res2 = await request(app).get(`/alert/close/${closedAlertID}`)
        .set('authorization', `JWT ${token}`);
      closedAlert = res2.body

      await request(app).post('/alert/create').send(alert3)
        .set('authorization', `JWT ${token}`);
    });

    it('Finds open alerts by vehicle', async () => {
      const res = await request(app).get(`/alerts/vehicle/${vehicleID}`)
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.arrayContaining([createdAlert]));
    });

    it('Finds closed alerts by vehicle', async () => {
      const res = await request(app).get(`/alerts/vehicle/${vehicleID}/?status=closed`)
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.arrayContaining([closedAlert]));
    });

    it('Finds all alerts by vehicle', async () => {
      const res = await request(app).get(`/alerts/vehicle/${vehicleID}/?status=all`)
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.arrayContaining([createdAlert, closedAlert]));
    });
  });

  describe('Alerts list', () => {
    let closedAlertID;
    let closedAlert;

    let alert2 = {
      vehicle: "614b55763db1ad77fe1fb5d4",
      type: "stuck_vehicle"
    }

    beforeEach(async () => {
      const res = await request(app).post('/alert/create').send(alert2)
        .set('authorization', `JWT ${token}`);
      closedAlertID = res.body._id;

      const res2 = await request(app).get(`/alert/close/${closedAlertID}`)
        .set('authorization', `JWT ${token}`);
      closedAlert = res2.body
    });

    it('Gets open alerts by vehicle', async () => {
      const res = await request(app).get('/alerts/')
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.arrayContaining([createdAlert]));
    });

    it('Gets closed alerts list', async () => {
      const res = await request(app).get('/alerts/?status=closed')
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.arrayContaining([closedAlert]));
    });

    it('Gets all alerts list', async () => {
      const res = await request(app).get('/alerts/?status=all')
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.arrayContaining([closedAlert, closedAlert]));
    });
  });

  it('Updates an alert', async () => {
    let updateAlert = {
      vehicle: "614b4819b563254b8458b639",
      type: "low_battery"
    }
    const res = await request(app).put(`/alert/update/${alertID}`).send(updateAlert)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.vehicle).toBe(updateAlert.vehicle);
    expect(res.body.type).toBe(updateAlert.type);
  });

  it('Receives error on updating alert', async () => {
    const res = await request(app).put('/alert/update/123').send(alert)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Could not update alert');
  });

  it('Deletes alert', async () => {
    const res = await request(app).delete(`/alert/delete/${alertID}`)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Alert deleted');
  });

  it('Receives error on deleting alert', async () => {
    const res = await request(app).delete('/alert/delete/123')
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Could not delete alert');
  });

  it('Closes alert', async () => {
    const res = await request(app).get(`/alert/close/${alertID}`)
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.finishedAt).not.toBe(null)
  });

  it('Receives error on closing alert', async () => {
    const res = await request(app).get('/alert/close/123')
      .set('authorization', `JWT ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Could not close alert');
  });

  describe('Validation errors on create', () => {

    it('Receives vehicle validation error on create alert', async () => {
      let errorAlert = {
        vehicle: "123",
        type: "low_fertilizer"
      }
      const res = await request(app).post('/alert/create').send(errorAlert)
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Could not create alert');
      expect(res.body.error.name).toBe('ValidationError');
      expect(res.body.error.message).toStrictEqual([
        'vehicle must be a vehicle ID'
      ]);
    });

    it('Receives type validation error on create alert', async () => {
      let errorAlert = {
        vehicle: "614b54fe71251f4b8f22761b",
        type: "123"
      }
      const res = await request(app).post('/alert/create').send(errorAlert)
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Could not create alert');
      expect(res.body.error.name).toBe('ValidationError');
      expect(res.body.error.message).toStrictEqual([
        `type must be one of ${ALERT_TYPES}`
      ]);
    });
  });

  describe('Validation errors on update', () => {

    it('Receives vehicle validation error on update alert', async () => {
      let errorAlert = {
        vehicle: "123",
        type: "low_fertilizer"
      }
      const res = await request(app).put(`/alert/update/${alertID}`).send(errorAlert)
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Could not update alert');
      expect(res.body.error.name).toBe('ValidationError');
      expect(res.body.error.message).toStrictEqual([
        'vehicle must be a vehicle ID'
      ]);
    });

    it('Receives type validation error on update alert', async () => {
      let errorAlert = {
        vehicle: "614b54fe71251f4b8f22761b",
        type: "123"
      }
      const res = await request(app).put(`/alert/update/${alertID}`).send(errorAlert)
        .set('authorization', `JWT ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Could not update alert');
      expect(res.body.error.name).toBe('ValidationError');
      expect(res.body.error.message).toStrictEqual([
        `type must be one of ${ALERT_TYPES}`
      ]);
    });
  });
});