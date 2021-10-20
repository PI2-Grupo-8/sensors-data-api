const app = require('./app')
const { connectDB , eraseDB} = require('./db')

const { PORT, NODE_ENV } = process.env;

connectDB()
  .then((db) => {
    // eraseDB(db)
    console.log(`MongoDB is connected on ${NODE_ENV}`);
  })
  .catch((err) => {
    console.log('Error on connecting to MongoDB', err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
