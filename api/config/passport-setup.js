import passport from "passport";
import AzureAdOAuth2Strategy from "passport-azure-ad-oauth2";
import "dotenv/config";
import jwt from "jsonwebtoken";
import Participant from "../models/participant.js";
import sendMail from "../services/email.js";

passport.use(
  "azuread-oauth2",
  new AzureAdOAuth2Strategy(
    {
      //callbackURL: `http://localhost:3000/auth/login/sfedu/callback`,
      callbackURL: `${process.env.WEB_URL}/api/auth/login/sfedu/callback`,
      clientID: process.env.SFEDU_ID,
      clientSecret: process.env.SFEDU_SECRET,
      resource: "https://graph.microsoft.com",
    },
    async function (accessToken, refreshToken, params, profile, done) {
      const waadProfile = jwt.decode(params.id_token, "", true);
      const [surname, name, patronymic] = waadProfile.name.split(" ");
      Participant.findOne({ where: { email: waadProfile.unique_name } }).then(
        (currentUser) => {
          if (currentUser) {
            currentUser.update({
              isMicrosoft: true,
              surname: surname,
              name: name,
              patronymic: patronymic,
            });
            done(null, currentUser);
          } else {
            new Participant({
              email: waadProfile.unique_name,
              name: name,
              surname: surname,
              patronymic: patronymic,
              organization: "Южный федеральный университет",
              degree: "Не выбрано",
              academicTitle: "Не выбрано",
              activate: true,
            })
              .save()
              .then((newUser) => {
                sendMail(
                  waadProfile.unique_name,
                  "authSfedu",
                  waadProfile.name
                );
                done(null, newUser);
              });
          }
        }
      );
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((req, user, done) => {
  Participant.findByPk(user)
    .then((_user) => {
      done(null, _user.id);
    })
    .catch(() => {
      req.logout();
      done(null, false);
    });
});

export default passport;
