const { Schema, model } = require("mongoose");

let guildDB = new Schema({
  guildID: { type: String, required: true },
  ticket: {
    status: { type: Boolean, default: false },
    channel: { type: String, default: "null" },
    message: { type: String, default: "null" },
    category: {type: String, default: "null"},
    open: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  }
});

let Guild = model("Guild", guildDB);
module.exports = Guild;
