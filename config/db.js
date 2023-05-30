const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to the database');
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
