const mongoose = require("mongoose");
const { DB_URI } = require("./index");

module.exports = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(":::> Connected to MongoDB database");
  } catch (error) {
    console.log("<::: Couldn't connect to database ", error);
  }
};
