const mongoose = require("mongoose");
const banco = new mongoose.Schema({
  userId: { type: String },
  banco: { type: Number },
  guildId: { type: String}
});
module.exports = mongoose.model("Bank", banco);
