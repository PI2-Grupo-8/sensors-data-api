const app = require('./app')
const { connectDB } = require('./db')

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
