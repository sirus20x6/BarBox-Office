const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: "943535004686-0i8a0p2c2t9fj8e2qh2gn9jnl8fvr2h2.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "http://memepipe.tv:3393/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
  // You can store user data in a database here
  return cb(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Routes for OAuth
router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

module.exports = router;
