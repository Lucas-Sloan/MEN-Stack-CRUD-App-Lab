//server.js
const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
const express = require("express");
const mongoose = require("mongoose"); // require package
const app = express();
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");

mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Team = require("./models/teams.js");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev")); 

app.use(express.static(path.join(__dirname, "public")))

const teamImageMap = {
  "cardinals": "/images/cardinals.png",
  "falcons": "/images/falcons.png",
  "ravens": "/images/ravens.png",
  "bills": "/images/bills.png",
  "panthers": "/images/panthers.png",
  "bears": "/images/bears.png",
  "bengals": "/images/bengals.png",
  "browns": "/images/browns.png",
  "cowboys": "/images/cowboys.png",
  "broncos": "/images/broncos.png",
  "lions": "/images/lions.jpg",
  "packers": "/images/packers.jpg",
  "texans": "/images/texans.png",
  "colts": "/images/colts.jpg",
  "jaguars": "/images/jaguars.png",
  "chiefs": "/images/chiefs.jpg",
  "raiders": "/images/raiders.png",
  "chargers": "/images/chargers.png",
  "rams": "/images/rams.jpg",
  "dolphins": "/images/dolphins.png",
  "vikings": "/images/vikings.jpg",
  "patriots": "/images/patriots.jpg",
  "saints": "/images/saints.png",
  "giants": "/images/giants.png",
  "jets": "/images/jets.png",
  "eagles": "/images/eagles.png",
  "steelers": "/images/steelers.png",
  "49ers": "/images/49ers.png",
  "seahawks": "/images/seahawks.png",
  "buccaneers": "/images/buccaneers.png",
  "titans": "/images/titans.png",
  "commanders": "/images/commanders.png",
};

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
  try {
      req.body.isReadyForPlayoffs = req.body.isReadyForPlayoffs === "on";

      const teamNameLower = req.body.name.toLowerCase();
      const imageUrl = teamImageMap[teamNameLower] || '/images/default.png';

      const newTeam = {
          city: req.body.city,
          name: req.body.name,
          imageUrl: imageUrl,
          isReadyForPlayoffs: req.body.isReadyForPlayoffs
      };

      await Team.create(newTeam);

      res.redirect("/teams");
  } catch (err) {
      console.error("Error adding team:", err);
      res.status(500).send("Internal Server Error");
  }
});

app.get("/teams/:teamId", async (req, res) => {
    const foundTeam = await Team.findById(req.params.teamId);
    res.render("teams/show.ejs", { team: foundTeam });
});

app.delete("/teams/:teamId", async (req, res) => {
  await Team.findByIdAndDelete(req.params.teamId);
  res.redirect("/teams");
});

app.get("/teams/:teamId/edit", async (req, res) => {
  const foundTeam = await Team.findById(req.params.teamId);
  res.render("teams/edit.ejs", {
    team: foundTeam,
  });
});

app.put("/teams/:teamId", async (req, res) => {
  if (req.body.isReadyForPlayoffs === "on") {
    req.body.isReadyForPlayoffs = true;
  } else {
    req.body.isReadyForPlayoffs = false;
  }
  
  await Team.findByIdAndUpdate(req.params.teamId, req.body);

  res.redirect(`/teams/${req.params.teamId}`);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});


