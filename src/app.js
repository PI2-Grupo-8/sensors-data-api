const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const { JWTValidate } = require('./utils/JWTValidate');

const app = express();
app.use(express.json());
app.use(JWTValidate);
app.use(cors());
app.use(routes);

module.exports = app;
