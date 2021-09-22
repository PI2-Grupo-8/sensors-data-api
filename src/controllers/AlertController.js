const Alert = require('../models/AlertSchema');
const { validateAlertData } = require('../utils/validateAlerts')

const getOneAlert = async (req, res) => {
  const { id } = req.params;
  try {
    const alert = await Alert.findById(id);
    return res.json(alert);
  } catch (err) {
    return res.status(400).json({
      message: "Could not get alert",
      error: err
    });
  }
};

const defineSearchStatusParam = (status) => {
  if (status === 'all') {
    return {};
  }
  if (status === 'closed') {
    return { finishedAt: { $ne: null } };
  }

  return { finishedAt: null };
}

const getAllAlerts = async (req, res) => {
  const { status } = req.query;

  try {
    const search = defineSearchStatusParam(status);
    const alerts = await Alert.find(search);
    return res.json(alerts);
  } catch (err) {
    return res.status(400).json({
      message: "Could not get alerts list",
      error: err
    });
  }
};

const getAlertsByVehicle = async (req, res) => {
  const { vehicle } = req.params;
  const { status } = req.query;

  try {
    const search = defineSearchStatusParam(status);
    const alerts = await Alert.find({vehicle, ...search});
    return res.json(alerts);
  } catch (err) {
    return res.status(400).json({
      message: "Could not find alerts",
      error: err
    });
  }
};

const createAlert = async (req, res) => {

  const { vehicle, type } = req.body;

  try {
    validateAlertData({vehicle, type})
    const newAlert = await Alert.create({ vehicle, type })
    return res.json(newAlert)
  } catch (err) {
    return res.status(400).json({
      message: "Could not create alert",
      error: err
    });
  }
};

const updateAlert = async (req, res) => {
  const { id } = req.params;
  const { vehicle, type } = req.body;

  try {
    validateAlertData({ vehicle, type })
    const alert = await Alert.findOneAndUpdate({ _id: id }, {
      vehicle, type
    }, { new: true })
    return res.json(alert)
  } catch (err) {
    return res.status(400).json({
      message: "Could not update alert",
      error: err
    });
  }
};


const closeAlert = async (req, res) => {
  const { id } = req.params;

  try {
    const finishedAt = Date.now()
    const alert = await Alert.findOneAndUpdate({ _id: id }, {
      finishedAt
    }, { new: true })
    return res.json(alert)
  } catch (err) {
    return res.status(400).json({
      message: "Could not close alert",
      error: err
    });
  }
}

const deleteAlert = async (req, res) => {
  const { id } = req.params;

  try {
    await Alert.findByIdAndDelete({ _id: id })
    return res.json({ message: 'Alert deleted' })
  } catch (err) {
    return res.status(400).json({
      message: "Could not delete alert",
      error: err
    });
  }
};

module.exports = {
  getAllAlerts,
  getOneAlert,
  getAlertsByVehicle,
  createAlert,
  updateAlert,
  closeAlert,
  deleteAlert
}
