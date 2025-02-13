import Participant from "../models/participant.js";
import {AppErrorAlreadyExists, AppErrorInvalid, AppErrorNotExist} from "../utils/errors.js";
import jwt from "../utils/jwt.js";
import sendMail from '../services/email.js';
import bcrypt from "bcrypt";

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

    async checkEmail(email, code){
        const participant = await Participant.findOne({
            where: { email: email }
        });

        if(!participant) throw new AppErrorInvalid('email')

        return await participant.update({activate: true})
    },

    async resetPassword(passwordInfo, participantId){

        const participant = await Participant.findByPk(participantId)

        if (!participant || !participant.validatePassword(passwordInfo.currentPassword)) throw new AppErrorInvalid('password');


        const hashPassword= bcrypt.hashSync(passwordInfo.newPassword, 10)

        return await participant.update({ password: hashPassword })

    }

}