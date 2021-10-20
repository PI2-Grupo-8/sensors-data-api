const ValidationError = require('../utils/validationError')
const ObjectId = require('mongoose').Types.ObjectId;
const SENSOR_DATA_TYPES = require('../utils/sensorDataTypes')

const {
  isValidObjectId,
  removeUndefinedValues
} = require('./basicValidation')

const vehicleValidation = (owner) => {
  if (owner && !isValidObjectId(owner)) {
    return 'vehicle must be a vehicle ID'
  }
}

const typeValidation = (type) => {
  if (!SENSOR_DATA_TYPES.includes(type)) {
    return `type must be one of ${SENSOR_DATA_TYPES}`
  }
}

const valueValidation = (value) => {
  if (!value || isNaN(value)) {
    return `value must exist`
  }
}

const validateSensorDataData = (req_body) => {

  const { vehicle, type, value } = req_body;
  errors = []

  errors.push(vehicleValidation(vehicle))
  errors.push(typeValidation(type))
  errors.push(valueValidation(value))

  errors = removeUndefinedValues(errors)

  if (errors.length > 0) {
    throw new ValidationError(errors)
  }
}

const validateGraphRequest = (req_body) => {
  const { vehicle, type } = req_body;
  errors = []

  errors.push(vehicleValidation(vehicle))
  errors.push(typeValidation(type))

  errors = removeUndefinedValues(errors)

  if (errors.length > 0) {
    throw new ValidationError(errors)
  }
}

module.exports = {
  validateSensorDataData,
  validateGraphRequest
}