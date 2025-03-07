if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();

const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const dbUrl = process.env.ATLASDB_URL;
const MongoStore = require("connect-mongo");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error", () => {
  console.log("ERROR in Mongo Session Store ", err);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

main()
  .then(() => {
    console.log("Connected To db");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}
app.listen(9090, () => {
  console.log("server is listening to port 9090");
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/ourteam", (req, res) => {
  res.render("team.ejs");
});

app.get("/connect", (req, res) => {
  res.render("connect.ejs");
});

app.get("/events", (req, res) => {
  res.render("events.ejs");
});

app.get("/events/:id", (req, res) => {
  if (req.params.id == "1") {
    res.render("specificEvents/1.ejs");
  } else if (req.params.id == 2) {
    res.render("specificEvents/2.ejs");
  } else if (req.params.id == 3) {
    res.render("specificEvents/3.ejs");
  } else if (req.params.id == 4) {
    res.render("specificEvents/4.ejs");
  } else if (req.params.id == 5) {
    res.render("specificEvents/5.ejs");
  } else if (req.params.id == 6) {
    res.render("specificEvents/6.ejs");
  }
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/faqs", (req, res) => {
  res.render("faqs.ejs");
});
