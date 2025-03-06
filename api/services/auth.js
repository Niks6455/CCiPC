import Participant from "../models/participant.js";
import {AppErrorAlreadyExists, AppErrorInvalid, AppErrorNotExist} from "../utils/errors.js";
import jwt from "../utils/jwt.js";
import sendMail from '../services/email.js';
import bcrypt from "bcrypt";
import typeCheckEmail from "../config/typeCheckEmail.js";
import cache from "../utils/cache.js";
import ParticipantOfReport from "../models/participant-of-report.js";
import ParticipantInConference from "../models/participant-in-conference.js";
import Conference from "../models/conference.js";
import Report from "../models/report.js";
const verificationCodes= {};
const resetCodes= {};

export default {
    async register(participant, code){

        const checkParticipant = await Participant.findOne({
            where: { email: participant.email }
        });

        if(checkParticipant) throw new AppErrorAlreadyExists('email')

        verificationCodes[participant.email] = code

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
            if(cache[email] !== undefined) {
                const participantOfReports = await ParticipantOfReport.bulkCreate(
                    cache[email]?.map(reportId => ({
                        reportId: reportId,
                        participantId: participant.id,
                        who: 'Соавтор'
                    })),
                    { returning: true }
                )

               const conferences=await Conference.findAll({
                 include: {
                     model: Report,
                     as: 'reports',
                     required: true,
                     where: {
                         id: participantOfReports.map(p=>p.reportId)
                     }
                 }
                })

                await ParticipantInConference.bulkCreate(conferences.map(conference => ({
                    conferenceId: conference.id,
                    participantId: participant.id
                })))
                delete cache[email]
            }

            await participant.update({activate: true})
            const { jwt: token } = jwt.generate({ id: participant.id });

            return { participant, token }
        }

        if(type === typeCheckEmail.RESET){
            if(resetCodes[email] !== code || code === undefined ) throw new AppErrorInvalid('code')
            return true
        }

        throw new AppErrorInvalid('type')
    },

    async resetPassword(passwordInfo, user){

        let participant
        if(user) participant = await Participant.findByPk(user.id)
        else participant = await Participant.findOne({ where : { email: passwordInfo.email } })
        if(passwordInfo.currentPassword) if (!participant || !participant.validatePassword(passwordInfo.currentPassword)) throw new AppErrorInvalid('password');
        if(!user && (resetCodes[participant?.email] !== passwordInfo.code || passwordInfo.code === undefined )) throw new AppErrorInvalid('code')

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

    },

}