const express = require('express');

const routes = express.Router();

const AlertController = require('./controllers/AlertController');
const SensorDataController = require('./controllers/SensorDataController');
const { loginRequired } = require('./utils/JWTValidate');

const { NODE_ENV } = process.env;

routes.get('/', (req, res) => {
  return res.status(200).json({ message: `Sensors Data API is running on ${NODE_ENV}` });
});

// Alerts can receive a query 'status' equal to 'closed' or 'all'
// without this query, it returns only opened alerts
routes.get('/alerts', loginRequired, AlertController.getAllAlerts);
routes.get('/alerts/vehicle/:vehicle', loginRequired, AlertController.getAlertsByVehicle);

routes.get('/alert/:id', loginRequired, AlertController.getOneAlert);
routes.post('/alert/create', loginRequired, AlertController.createAlert);
routes.put('/alert/update/:id', loginRequired, AlertController.updateAlert);
routes.get('/alert/close/:id', loginRequired, AlertController.closeAlert);
routes.delete('/alert/delete/:id', loginRequired, AlertController.deleteAlert);

routes.get('/data/graph/:vehicle/:type', loginRequired, SensorDataController.getGraph);

routes.post('/data/:vehicle', loginRequired, SensorDataController.createSensorData);
routes.get('/data/:vehicle/:type', loginRequired, SensorDataController.getData);

module.exports = routes;
