require("dotenv").config({ path: `./server/.env.${process.env.NODE_ENV}` });
// var LineStrategy = require("passport-line").Strategy;
const LineStrategy = require("passport-line-auth").Strategy;
const axios = require("axios");
const jwt = require("jsonwebtoken");

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });

  passport.use(
    new LineStrategy(
      {
        channelID: process.env.LINE_CHANNEL_ID,
        channelSecret: process.env.LINE_CHANNEL_SECRET,
        callbackURL: `${process.env.BASE_PATH}/server/line/callback`,
        scope: JSON.parse(process.env.LINE_SCOPE),
        botPrompt: process.env.LINE_BOT_PROMPT,
      },
      async function (accessToken, refreshToken, params, profile, done) {
        const { email } = jwt.decode(params.id_token);
        profile.email = email;
        profile.token = accessToken

        done(null, profile);
      }
    )
  );
};
