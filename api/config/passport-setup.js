import passport from 'passport';
import AzureAdOAuth2Strategy from 'passport-azure-ad-oauth2';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import Participant from '../models/participant.js';
import jwtUtil from '../utils/jwt.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((req, user, done) => {
  Participant.findByPk(user)
    .then(_user => {
      done(null, _user.id);
    })
    .catch(() => {
      req.logout();
      done(null, false);
    });
});
passport.use(
  new AzureAdOAuth2Strategy(
    {
       //callbackURL: 'http://localhost:3002/login/authorization',
      callbackURL: `${process.env.WEB_URL}/login/authorization`,
      clientID: process.env.SFEDU_ID,
      clientSecret: process.env.SFEDU_SECRET,
    },
    async function (accessToken, refreshToken, params, profile, done) {
      const waadProfile = jwt.decode(params.id_token, '', true);
      Participant.findOne({ where: { email: waadProfile.unique_name } }).then(currentUser => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new Participant({
            email: waadProfile.unique_name,
            name: waadProfile.name,
          })
            .save()
            .then(newUser => {
              done(null, newUser);
            });
        }
      });
    }
  )
);

export default passport;
