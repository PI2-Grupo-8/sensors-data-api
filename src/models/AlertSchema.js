const mongoose = require('mongoose');
const ALERT_TYPES = require('../utils/alertTypes')

const AlertSchema = new mongoose.Schema({
  vehicle: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    enum: ALERT_TYPES,
    require: true,
  },
  finishedAt: {
    type: Date,
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model('Alert', AlertSchema);