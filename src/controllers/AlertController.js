const Alert = require('../models/AlertSchema');


const getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find();
    return res.json(alerts);
  } catch (err) {
    return res.status(400).json({
      message: "Could not get alerts list",
      error: err
    });
  }
};

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

// TODO: Alerta por trator (ativos/finalizados)

const createAlert = async (req, res) => {

  const { vehicle, type } = req.body;

  try {
    // TODO: Validar dados
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
    // TODO: Validar dados
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

// TODO: Finalizar alerta

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
  createAlert,
  updateAlert,
  deleteAlert
}
