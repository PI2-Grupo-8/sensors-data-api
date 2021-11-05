const mongoose = require("mongoose");
const { connectDB } = require('../src/db')
const SensorData = require('../src/models/SensorDataSchema');
const Alert = require('../src/models/AlertSchema');

const SENSOR_DATA_TYPES = require('../src/utils/sensorDataTypes')

const randomValueBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const types_converter = {
  battery_data: "low_battery",
  tank_data: "low_fertilizer"
}

const dataLoop = async (vehicle, type) => {
  console.log(`====> Populating ${type}`)
  const today = new Date();

  const oneDay = 24 * 60 * 60 * 1000;
  const timePeriod = oneDay / 100;

  let createdAlert = false

  for (let day = 7; day >= 0; day--) {
    let date = new Date()
    date.setDate(today.getDate() - day);

    for (let index = 0; index < 100; index++) {
      const value = parseInt((100 - index) / 10) * 10
      const createdAt = new Date(date.getTime() - oneDay + (timePeriod * index));

      if (SENSOR_DATA_TYPES.slice(0, 2).includes(type) && (100 - index) === 10 && !createdAlert) {
        createdAlert = true
        await Alert.create({ vehicle, type: types_converter[type] })
      }

      await SensorData.create({ vehicle, type, value, createdAt })
    }
  }
}

const addDistance =  async (vehicle) => {
  const type = SENSOR_DATA_TYPES[2]
  console.log(`====> Populating ${type}`)

  const value = randomValueBetween(0, 100)

  await SensorData.create({ vehicle, type, value })
}

const populateDBWithData = async (vehicleId) => {

  try {
    await dataLoop(vehicleId, SENSOR_DATA_TYPES[0])
    await dataLoop(vehicleId, SENSOR_DATA_TYPES[1])
    await addDistance(vehicleId)

    console.log('====> Populado!')
  } catch (err) {
    console.error(err)
  }
}


const script = async(process) => {
  const params = process.argv[2]
  if (!params) {
    console.log({ message: 'Missing the vehicle ID' })
    return
  }

  connectDB();
  await populateDBWithData(params)
  mongoose.connection.close()
};


script(process);
