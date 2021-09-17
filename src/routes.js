const express = require('express');

const routes = express.Router();

const AlertController = require('./controllers/AlertController');

const { NODE_ENV } = process.env;

routes.get('/', (req, res) => {
  return res.status(200).json({ message: `Sensors Data API is running on ${NODE_ENV}` });
});

routes.get('/alerts', AlertController.getAllAlerts);
routes.get('/alert/:id', AlertController.getOneAlert);
routes.post('/alert/create', AlertController.createAlert);
routes.put('/alert/update/:id', AlertController.updateAlert);
routes.delete('/alert/delete/:id', AlertController.deleteAlert);

// TODO: Alertas por trator (ativos/finalizados)
// TODO: Finalizar alerta

module.exports = routes;
