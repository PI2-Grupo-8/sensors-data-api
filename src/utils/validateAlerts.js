const ValidationError = require('../utils/validationError')
const ObjectId = require('mongoose').Types.ObjectId;
const ALERT_TYPES = require('../utils/alertTypes')

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
  if(!ALERT_TYPES.includes(type)){
    return `type must be one of ${ALERT_TYPES}`
  }
}

const validateAlertData = (req_body) => {

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
  validateAlertData
}