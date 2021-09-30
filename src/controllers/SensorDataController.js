const SensorData = require('../models/SensorDataSchema');
const { validateSensorDataData } = require('../utils/validateSensorData')


const getData = async (req, res) => {
  const { vehicle, type } = req.params;

  try {
    const data = await SensorData.find({ vehicle, type });
    return res.json(data);
  } catch (err) {
    return res.status(400).json({
      message: "Could not find data",
      error: err
    });
  }
};

const createSensorData = async (req, res) => {
  const { vehicle } = req.params;
  const { type, value } = req.body;

  try {
    validateSensorDataData({ vehicle, type, value })
    const newData = await SensorData.create({ vehicle, type, value })
    return res.json(newData)
  } catch (err) {
    return res.status(400).json({
      message: "Could not create data",
      error: err
    });
  }
};

module.exports = {
  getData,
  createSensorData
}
