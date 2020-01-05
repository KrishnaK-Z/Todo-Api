const mongoose = require('./database');
require('dotenv/config');
// const config = require('../../config')();

const init = async () => {
  if (!mongoose.connection.readyState) {
    mongoose
      .connect("mongodb://localhost:27017/todoTasks", {
        useNewUrlParser: true,
      })
      .then(() => console.log('MongoDB connected'))
      .then(() => mongoose);

      // To prevent deprectation warnings (from MongoDB native driver)
      mongoose.set('useCreateIndex', true);
      mongoose.set('useFindAndModify', false);

      return mongoose;
  }

  return mongoose;
};

const middleware = async (req, res, next) => {
  try {
    await init();
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
    return;
  }
  return next();
};

exports.init = init;
exports.middleware = middleware;
