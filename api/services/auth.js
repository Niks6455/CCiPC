import Participant from "../models/participant.js";
import {AppErrorAlreadyExists, AppErrorInvalid, AppErrorNotExist} from "../utils/errors.js";
import jwt from "../utils/jwt.js";
import sendMail from '../services/email.js';
import bcrypt from "bcrypt";
import typeCheckEmail from "../config/typeCheckEmail.js";
const verificationCodes= {};
const resetCodes= {};

export default {
    async register(participant, code){

        console.log(participant);
        const checkParticipant = await Participant.findOne({
            where: { email: participant.email }
        });

        console.log(111)
        if(checkParticipant) throw new AppErrorAlreadyExists('email')

        sendMail(participant.email, 'registration', code);

        return  await Participant.create({
            ...participant,
            password: participant.hashPassword
        })
    },

    async login(email, password){

        const participant = await Participant.findOne({
            where: { email: email }
        });

        if (!participant || !participant.validatePassword(password)) throw new AppErrorInvalid('Login or password', 403);

        const { jwt: token } = jwt.generate({ id: participant.id });

        return {participant, token};

    },

    async checkEmail(email, code, type){
        const participant = await Participant.findOne({
            where: { email: email }
        });

        if(!participant) throw new AppErrorInvalid('email')

        if(type === typeCheckEmail.CONFIRM)  {
            if(verificationCodes[email] !== code || code === undefined ) throw new AppErrorInvalid('code')
            await participant.update({activate: true})
            return true
        }

        if(type === typeCheckEmail.RESET){
            if(resetCodes[email] !== code || code === undefined ) throw new AppErrorInvalid('code')
            return true
        }

        throw new AppErrorInvalid('type')
    },

    async resetPassword(passwordInfo, participantId){

        let participant
        if(participantId) participant = await Participant.findByPk(participantId)
        else participant = await Participant.findOne({ where : { email: passwordInfo.email } })
        if(passwordInfo.currentPassword) if (!participant || !participant.validatePassword(passwordInfo.currentPassword)) throw new AppErrorInvalid('password');
        if(resetCodes[participant?.email] !== passwordInfo.code || passwordInfo.code === undefined ) throw new AppErrorInvalid('code')

        const hashPassword = bcrypt.hashSync(passwordInfo.newPassword, 10)

        return await participant.update({password: hashPassword})

    },

    async sandCodeChangePassword(email,code){
        const participant = await Participant.findOne({
            where: { email: email }
        })
        if(!participant) throw new AppErrorNotExist('email')
        resetCodes[email] = code
        sendMail(email, 'reset', code);
        return true

    }

}