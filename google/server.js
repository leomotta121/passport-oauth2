const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "479618265597-t0crngffvje8u3ro1qg2r6ept6qlavll.apps.googleusercontent.com",
      clientSecret: "3icaALSE-4xN6snqbMlnSCHP",
      callbackURL: "http://localhost:3000/my-app"
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function(err, user) {
        return cb(err, user);
      });
    }
  )
);

app.get("/", (req, res) => {
  res.json();
});

app.get(
  "/auth/google",

  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",

  passport.authenticate("google", { failureRedirect: "/login" }),

  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.listen(3333);
