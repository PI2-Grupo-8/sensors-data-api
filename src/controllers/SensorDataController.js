const SensorData = require('../models/SensorDataSchema');
const Alert = require('../models/AlertSchema');
const { validateSensorDataData, validateGraphRequest } = require('../utils/validateSensorData');
const SENSOR_DATA_TYPES = require('../utils/sensorDataTypes');

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

  const types_converter = {
    battery_data: "low_battery",
    tank_data: "low_fertilizer"
  }

  try {
    validateSensorDataData({ vehicle, type, value })
    const newData = await SensorData.create({ vehicle, type, value })

    if (SENSOR_DATA_TYPES.slice(0, 2).includes(type) && value <= 10) {
      await Alert.create({ vehicle, type: types_converter[type] })
    }

    return res.json(newData)
  } catch (err) {
    return res.status(400).json({
      message: "Could not create data",
      error: err
    });
  }
};

const getGraph = async (req, res) => {
  const { type, vehicle } = req.params;
  const { period } = req.query;

  const days = period === 'week' ? 7 : 1;

  const oneDay = 24 * 60 * 60 * 1000;

  try {
    validateGraphRequest({ type, vehicle })
    const data = await SensorData.find({
      vehicle,
      type,
      createdAt: { $gt: new Date(Date.now() - (oneDay * days)) }
    }).sort('-createdAt');

    const multiple = parseInt(data.length / 25);
    const filteredData = data.length > 25 ? data.filter((_, idx) => (idx % multiple) === 0) : data
    const graph = filteredData.map((e) => {
      return { x: e.createdAt, y: parseFloat(e.value) }
    })

    return res.json(graph)
  } catch (err) {
    return res.status(400).json({
      message: "Could not get graph",
      error: err
    });
  }
}

module.exports = {
  getData,
  createSensorData,
  getGraph
}
