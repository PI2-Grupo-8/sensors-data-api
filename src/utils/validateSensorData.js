const ValidationError = require('../utils/validationError')
const ObjectId = require('mongoose').Types.ObjectId;
const SENSOR_DATA_TYPES = require('../utils/sensorDataTypes')

function isValidObjectId(id) {
  if (ObjectId.isValid(id)) {
    if ((String)(new ObjectId(id)) === id)
      return true;
    return false;
  }
  return false;
}

const removeUndefinedValues = (arr) => {
  return arr.filter((element) => {
    return element !== undefined;
  });
}

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

module.exports = {
  validateSensorDataData
}