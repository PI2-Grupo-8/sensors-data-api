const mongoose = require("mongoose");

const {
  DB_USER,
  DB_PASS,
  DB_DEV,
  DB_TEST,
  DB_HOST,
  NODE_ENV
} = process.env;

const connectDB = async () => {
  const db_name = NODE_ENV === 'test' ? DB_TEST : DB_DEV;
  const url = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}/${db_name}`;

  const db = await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

  return db
}

const eraseDB = async (db) => {
  const collections = Object.keys(db.connection.collections);
  for (const collectionName of collections) {
    const collection = db.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

module.exports = {
  connectDB,
  eraseDB
}