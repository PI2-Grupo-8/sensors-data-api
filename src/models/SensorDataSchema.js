const mongoose = require('mongoose');
const SENSOR_DATA_TYPES = require('../utils/sensorDataTypes');

const SensorDataSchema = new mongoose.Schema({
  vehicle: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    enum: SENSOR_DATA_TYPES,
    require: true,
  },
  value: {
    type: mongoose.Decimal128,
    enum: SENSOR_DATA_TYPES,
    require: true,
  }

}, { timestamps: true });

module.exports = mongoose.model('SensorData', SensorDataSchema);