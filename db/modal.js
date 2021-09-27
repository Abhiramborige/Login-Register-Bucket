const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  buckets:[]
});

// name of model and schema.
module.exports = mongoose.model("userDatabase", userSchema);
