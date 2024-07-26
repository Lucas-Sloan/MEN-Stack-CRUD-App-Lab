//  models/teams.ejs
const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    city: { type: String, required: true },
    name: { type: String, required: true },
    isReadyForPlayoffs: {type: Boolean},
    imageUrl: String
  });

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;