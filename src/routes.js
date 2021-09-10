const express = require('express');

const routes = express.Router();

const { NODE_ENV } = process.env;

routes.get('/', (req, res) => {
  return res.status(200).json({ message: `Sensors Data API is running on ${NODE_ENV}` });
});

module.exports = routes;
