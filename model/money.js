const mongoose = require("mongoose");
const moneySchema = new mongoose.Schema({
  userId: { type: String },
  dinero: { type: Number },
  guildId: { type: String }
});
module.exports = mongoose.model("Money", moneySchema);
