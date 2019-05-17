const mongoose = require('mongoose');
const config = require('config');

const databaseURI = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(databaseURI, {
      useNewUrlParser: true
    });

    console.log('Database Connected ...');
  } catch (error) {
    console.error(error.message);
    // Exit with error message
    process.exit(1);
  }
};

module.exports = connectDB;
