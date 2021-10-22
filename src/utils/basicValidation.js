
const ObjectId = require('mongoose').Types.ObjectId;

const isValidObjectId = (id) => {
  if (ObjectId.isValid(id)) {
    if ((String)(new ObjectId(id)) === id)
      return true;
    return false;
  }
  return false;
}

const removeUndefinedValues = (arr) => {
  return arr.filter((element) => {
    return element !== undefined && element !== null;
  });
}

module.exports = {
  isValidObjectId,
  removeUndefinedValues
}