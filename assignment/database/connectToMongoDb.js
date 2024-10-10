const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const connectToMongoDb = async function () {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected...");
  } catch (error) {
    console.log("Error connecting to MongoDB.");
    console.log(error);
  }
};

module.exports = connectToMongoDb;
