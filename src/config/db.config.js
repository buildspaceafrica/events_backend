const mongoose = require("mongoose");
const { DB_URI } = require("./index");
const logger = require("../utils/logger")

module.exports = async () => {
  try {
    await mongoose.connect(DB_URI);
    logger.info(":::> Connected to MongoDB database");
  } catch (error) {
    logger.error("<::: Couldn't connect to database ", error);
  }
};
