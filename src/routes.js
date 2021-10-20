const express = require('express');

const routes = express.Router();

const AlertController = require('./controllers/AlertController');
const SensorDataController = require('./controllers/SensorDataController');

const { NODE_ENV } = process.env;

routes.get('/', (req, res) => {
  return res.status(200).json({ message: `Sensors Data API is running on ${NODE_ENV}` });
});

// Alerts can receive a query 'status' equal to 'closed' or 'all'
// without this query, it returns only opened alerts
routes.get('/alerts', AlertController.getAllAlerts);
routes.get('/alerts/vehicle/:vehicle', AlertController.getAlertsByVehicle);

routes.get('/alert/:id', AlertController.getOneAlert);
routes.post('/alert/create', AlertController.createAlert);
routes.put('/alert/update/:id', AlertController.updateAlert);
routes.get('/alert/close/:id', AlertController.closeAlert);
routes.delete('/alert/delete/:id', AlertController.deleteAlert);

routes.get('/data/graph/:vehicle/:type', SensorDataController.getGraph);

routes.post('/data/:vehicle', SensorDataController.createSensorData);
routes.get('/data/:vehicle/:type', SensorDataController.getData);

module.exports = routes;
