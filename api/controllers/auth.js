import { AppErrorInvalid, AppErrorMissing } from "../utils/errors.js";
import authService from "../services/auth.js";
import bcrypt from "bcrypt";
import randomCode from "../utils/random-code.js";
const atLeastOneDigit = /\d/,
  atLeastOneLowerLetter = /[a-z]/,
  atLeastOneUpperLetter = /[A-Z]/,
  atLeastOneSpecial = /[!@_#$%^&*]/,
  otherChars = /[^0-9a-zA-Z!@_#$%^&*]/g;

export default {
  async login({ body: { email, password } }, res) {
    if (!email) throw new AppErrorMissing("email");
    if (!password) throw new AppErrorMissing("password");

    const { participant, token } = await authService.login(email, password);
    res.json({ participant, token: token });
  },

  async register(
    {
      body: {
        email,
        password,
        name,
        surname,
        patronymic,
        academicTitle,
        degree,
        position,
        organization,
        phone,
      },
    },
    res
  ) {
    if (!email) throw new AppErrorMissing("email");
    if (!password) throw new AppErrorMissing("password");

    const isValid =
      atLeastOneDigit.test(password) &&
      atLeastOneLowerLetter.test(password) &&
      atLeastOneUpperLetter.test(password) &&
      atLeastOneSpecial.test(password) &&
      !otherChars.test(password) &&
      password.length >= 8 &&
      password.length <= 20;

    if (!isValid) throw new AppErrorInvalid("password");

    if (!name) throw new AppErrorMissing("name");
    if (!surname) throw new AppErrorMissing("surname");
    if (!academicTitle) throw new AppErrorMissing("academicTitle");
    if (!degree) throw new AppErrorMissing("degree");
    if (!position) throw new AppErrorMissing("position");
    if (!organization) throw new AppErrorMissing("organization");
    if (!phone) throw new AppErrorMissing("phone");

    const code = randomCode(6, "0123456789");
    console.log("code", code);
    const hashPassword = bcrypt.hashSync(password, 10);
    const participant = await authService.register(
      {
        email,
        hashPassword,
        name,
        surname,
        patronymic,
        academicTitle,
        degree,
        position,
        organization,
        phone,
      },
      code
    );

    res.json(participant);
  },

  async checkEmail({ body: { email, code } }, res) {
    if (!email) throw new AppErrorMissing("email");
    if (!code) throw new AppErrorMissing("code");

    const participant = await authService.checkEmail(email, code);
    res.json(participant);
  },

  async loginSfedu(req, res) {},
  async reset(
    { body: { currentPassword, newPassword, repeatPassword }, user },
    res
  ) {
    if (!newPassword !== repeatPassword) throw AppErrorInvalid("newPassword");
    await authService.resetPassword(
      { currentPassword, newPassword, repeatPassword },
      user
    );

    res.json({ status: "ok" });
  },
};
