const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
const express = require("express");
const mongoose = require("mongoose"); // require package
const app = express();

mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Team = require("./models/teams.js");

app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
    res.render("index.ejs");
});

app.get("/teams", async (req, res) => {
    const allTeams = await Team.find();
    console.log(allTeams);
    res.render("teams/index.ejs", { teams: allTeams });
});

app.get("/teams/new", (req, res) => {
    res.render("teams/new.ejs");
});

app.post("/teams", async (req, res) => {
    if (req.body.isReadyForPlayoffs === "on") {
      req.body.isReadyForPlayoffs = true;
    } else {
      req.body.isReadyForPlayoffs = false;
    }
    await Team.create(req.body);
    res.redirect("/teams");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});


