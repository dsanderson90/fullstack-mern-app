const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DataSchema = new Schema(
  {
    id: Number,
    msg: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Data", DataSchema);