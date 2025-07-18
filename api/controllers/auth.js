import {AppErrorInvalid, AppErrorMissing} from "../utils/errors.js";
import authService from "../services/auth.js";
import bcrypt from "bcrypt";
import randomCode from "../utils/random-code.js";
import validateEmail from "../utils/validate/email.js";
import validateName from "../utils/validate/name.js";
import validatePhoneNumber from "../utils/validate/phone.js";
import validateOrganization from "../utils/validate/organization.js";

const atLeastOneDigit = /\d/,
    atLeastOneLowerLetter = /[a-z]/,
    atLeastOneUpperLetter = /[A-Z]/,
    atLeastOneSpecial = /[!@_#$%^&*]/,
    otherChars = /[^0-9a-zA-Z!@_#$%^&*]/g;

export default {

    async login({body: {email, password}}, res) {

        if(!email) throw new AppErrorMissing('email')
        if(!password) throw new AppErrorMissing('password')

        const {participant, token} = await authService.login(email, password);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 31536000000
        });


        res.json({ participant });
    },


    async register({ body: {email, password, name, surname, patronymic, academicTitle, degree, position, organization, phone} }, res) {
        if(!email) throw new AppErrorMissing('email')
        if(!password) throw new AppErrorMissing('password')


        const isValid =
            atLeastOneDigit.test(password) &&
            atLeastOneLowerLetter.test(password) &&
            atLeastOneUpperLetter.test(password) &&
            atLeastOneSpecial.test(password) &&
            !otherChars.test(password) &&
            password.length >= 8 &&
            password.length <= 16;

        if (!isValid) throw new AppErrorInvalid('password');
        if(!validateEmail(email)) throw new AppErrorInvalid('email')

        if(!name) throw new AppErrorMissing('name')
        if(!validateName(name)) throw new AppErrorInvalid('name')

        if(!surname) throw new AppErrorMissing('surname')
        if(!validateName(surname)) throw new AppErrorInvalid('surname')

        if(patronymic && (!validateName(patronymic) || (patronymic.length < 5))) throw new AppErrorInvalid('patronymic')

        if(!academicTitle) throw new AppErrorMissing('academicTitle')
        if(!degree) throw new AppErrorMissing('degree')

        if(!organization) throw new AppErrorMissing('organization')
        if(!validateOrganization(organization)) throw new AppErrorInvalid('organization')

        if(position && (position.length < 1 || position.length > 200)) throw new AppErrorInvalid('position')

        if(!phone) throw new AppErrorMissing('phone')
        if(!validatePhoneNumber(phone)) throw new AppErrorInvalid('phone')

        const code = randomCode(6, '0123456789');

        const hashPassword= bcrypt.hashSync(password, 10)
        const participant =await authService.register({
            email, hashPassword, name, surname, patronymic, academicTitle, degree, position, organization, phone
        }, code)

        res.json(participant)
    },

    async checkEmail({body: { email, code, type }}, res) {
        if(!email) throw new AppErrorMissing('email')
        if(!validateEmail(email)) throw new AppErrorInvalid('email')

        if(!code) throw new AppErrorMissing('code')
        if(type === undefined) throw new AppErrorMissing('type')
        const { participant, token } = await authService.checkEmail(email, code, type)

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 31536000000
        });

        res.json({ participant: participant, jwt: token })
    },

    async   loginSfedu(req, res) {
        const {token, participant } = await authService.loginSfedu(req.user)

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 31536000000
        });


        res.redirect(`${process.env.WEB_URL}/`);
    },

    async sandCodeChangePassword({body:  { email } }, res){
        if(!email) throw new AppErrorMissing('email')
        if(!validateEmail(email)) throw new AppErrorInvalid('email')
        const code = randomCode(6, '0123456789');
        await authService.sandCodeChangePassword(email, code, 0)
        res.json({status: 'Ok'})
    },

    async sandConfirm({body: { email }},res){
        if(!email) throw new AppErrorMissing('email')
        if(!validateEmail(email)) throw new AppErrorInvalid('email')
        const code = randomCode(6, '0123456789');
        await authService.sandCodeChangePassword(email, code, 1)
        res.json({status: 'Ok'})
    },

    async reset({ body: { currentPassword, newPassword, repeatPassword, code, email }, user, admin }, res) {
        const isValid =
            atLeastOneDigit.test(newPassword) &&
            atLeastOneLowerLetter.test(newPassword) &&
            atLeastOneUpperLetter.test(newPassword) &&
            atLeastOneSpecial.test(newPassword) &&
            !otherChars.test(newPassword) &&
            newPassword.length >= 8 &&
            newPassword.length <= 16;
        if(newPassword !== repeatPassword || !isValid) throw new AppErrorInvalid('newPassword')
        const userToReset = user || admin; // Определяем, кто выполняет сброс пароля
        if(userToReset && !currentPassword) throw new AppErrorMissing('currentPassword')
        if(!userToReset && (!code || !email)) throw new AppErrorMissing('code')
        if(userToReset) await  authService.resetPassword({currentPassword, newPassword, repeatPassword }, userToReset )
        else await authService.resetPassword({newPassword, repeatPassword, code, email })
        res.json({status: 'ok'})
    },





}