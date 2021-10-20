const SensorData = require('../models/SensorDataSchema');
const { validateSensorDataData, validateGraphRequest } = require('../utils/validateSensorData')

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

const getGraph = async (req, res) => {
  const { type, vehicle } = req.params;
  const oneDay = 24 * 60 * 60 * 1000;

  try{
    validateGraphRequest({type, vehicle})
    const data = await SensorData.find({
      vehicle,
      type,
      createdAt: { $gt: new Date(Date.now() - oneDay) }
    });

    const graph = data.map((e) =>{
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
