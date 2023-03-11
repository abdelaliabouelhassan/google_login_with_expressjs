require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");

const app = express();

require("./Passport");

app.set("view engine", "ejs");
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.get("/success", (req, res) =>
  res.render("pages/profile.ejs", {
    name: req.user.displayName,
    email: req.user.emails[0].value,
    photo: req.user.photos[0].value,
    id: req.user.id,
    provider: req.user.provider,
    profileUrl: req.user.profileUrl,
  })
);

app.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }) // scope is used to specify what data we want to get from the user
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/success");
  }
);

app.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    res.redirect("/"); //Inside a callback… bulletproof!
  });
});

app.get("/failed", (req, res) => {
  res.send("You Failed to log in!");
});

app.listen(4000, () => {
  console.log("Server Running on port 4000");
});
