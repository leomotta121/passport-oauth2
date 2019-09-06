const express = require("express");
const passport = require("passport");
const GoogleToken = require("passport-google-token").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

passport.use(
  new GoogleToken(
    {
      clientID:
        "479618265597-t0crngffvje8u3ro1qg2r6ept6qlavll.apps.googleusercontent.com",
      clientSecret: "3icaALSE-4xN6snqbMlnSCHP",
      callbackURL: "/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
      console.log(profile);

      return cb(null, profile);
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

  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login"
  }),

  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("http://localhost:3000/");
  }
);

app.get(
  "/private",
  passport.authenticate("google-token", { session: false }),

  function(req, res, next) {
    if (!req.user) return res.status(401).json();

    req.auth = {
      id: req.user.id
    };

    return next();
  },

  function(req, res, next) {
    return res.json({
      message: "You are logged!",
      auth: req.auth,
      user: req.user
    });
  }
);

app.listen(3333);
