const { connectDB } = require('./db')
const app = require('./app');

const { PORT, NODE_ENV } = process.env;

connectDB()
  .then(() => {
    console.log(`MongoDB is connected on ${NODE_ENV}`);
  })
  .catch((err) => {
    console.log('Error on connecting to MongoDB', err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
