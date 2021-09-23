function ValidationError(message) {
  this.name = 'ValidationError';
  this.message = message || 'Error on data validation';
}

ValidationError.prototype = Object.create(ValidationError.prototype);
ValidationError.prototype.constructor = ValidationError;

module.exports = ValidationError
