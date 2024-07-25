const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    name: String,
    isReadyForPlayoffs: Boolean,
  });

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;