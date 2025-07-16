import Participant from "../models/participant.js";
import {AppErrorAlreadyExists, AppErrorForbiddenAction, AppErrorInvalid, AppErrorNotExist} from "../utils/errors.js";
import jwt from "../utils/jwt.js";
import sendMail from '../services/email.js';
import bcrypt from "bcrypt";
import typeCheckEmail from "../config/typeCheckEmail.js";
import cache from "../utils/cache.js";
import { getValue } from "../utils/cache.js";
import ParticipantOfReport from "../models/participant-of-report.js";
import ParticipantInConference from "../models/participant-in-conference.js";
import Conference from "../models/conference.js";
import Report from "../models/report.js";
import {Op} from "sequelize";
import 'dotenv/config'

async function saveVerificationCode(email, code, expirationTime) {
    const value = await getValue(email)
    if(process.env.NODE_ENV !== "production" && email === 'autotest@example.com' ) {
        value.verificationCode = { code: '000000', expiresAt: Date.now() + expirationTime };
        await cache.set(email, JSON.stringify(value));
    }else {
        value.verificationCodes = { code: code, expiresAt: Date.now() + expirationTime }
        await cache.set(email, JSON.stringify(value));
    }
    setTimeout(async () => {
        const value = await getValue(email)
        delete value?.verificationCodes;
        await cache.set(email, JSON.stringify(value));
    }, expirationTime);

}

async function resetCode(email,code){
    const value = await getValue(email)
    if(process.env.NODE_ENV !== "production" && email === 'autotest@example.com' ) {
        value.resetCodes = { code: '000000'}
        await cache.set(email, JSON.stringify(value));
    }else {
        value.resetCodes = { code: code }
        await cache.set(email, JSON.stringify(value));
    }
}
export default {
    async register(participant, code){

        const checkParticipant = await Participant.findOne({
            where: {
                [Op.or]: [
                    { email: participant.email },
                    { phone: participant.phone }
                ]
            }
        });

        if(checkParticipant) throw new AppErrorAlreadyExists('email or phone')

        await saveVerificationCode(participant.email, code, 300000)

        sendMail(participant.email, 'registration', code);

        return  await Participant.create({
            ...participant,
            password: participant.hashPassword
        })
    },

    async loginSfedu(participant){

        const { access_token, refresh_token } = jwt.generate({ id: participant.id });
        return { access_token, refresh_token };

    },

    async login(email, password){

        const participant = await Participant.findOne({
            where: { email: email }
        });

        if(!participant) throw new AppErrorNotExist('email')
        if (!participant || !participant.validatePassword(password)) throw new AppErrorInvalid('Login or password', 403);

        if(!participant.activate) throw new AppErrorForbiddenAction(403,'no activate');

        const { access_token, refresh_token } = jwt.generate({ id: participant.id });

        return {participant, access_token, refresh_token };

    },

    async checkEmail(email, code, type){
        const participant = await Participant.findOne({
            where: { email: email }
        });

        if(!participant) throw new AppErrorInvalid('email')


        if(type === typeCheckEmail.CONFIRM)  {
            const value = await getValue(email);
            if(value?.verificationCodes?.code !== code || code === undefined ) throw new AppErrorInvalid('code')
            if (value?.coAuthors !== undefined) {
                const coAuthorsCache = value.coAuthors
                const participantOfReports = await ParticipantOfReport.bulkCreate(
                  await Promise.all(
                    coAuthorsCache.map(async reportId => {
                        const report = await Report.findByPk(reportId);
                        if (report) {
                            return {
                                reportId: reportId,
                                participantId: participant.id,
                                who: 'Соавтор'
                            };
                        }
                        return null;
                    })
                  ).then(results => results.filter(item => item !== null)),
                  { returning: true }
                );

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

                delete value.coAuthors;
                await cache.set(email, JSON.stringify(value));
            }

            await participant.update({activate: true})
            const { access_token, refresh_token } = jwt.generate({ id: participant.id });

            return { participant, access_token, refresh_token }
        }

        if(type === typeCheckEmail.RESET){
            const value = await getValue(email);
            if(value?.resetCodes?.code !== code || code === undefined ) throw new AppErrorInvalid('code')
            return true
        }

        throw new AppErrorInvalid('type')
    },

    async resetPassword(passwordInfo, user){

        let participant
        if(user) participant = await Participant.findByPk(user.id)
        else participant = await Participant.findOne({ where : { email: passwordInfo.email } })
        if(passwordInfo.currentPassword) if (!participant || !participant.validatePassword(passwordInfo.currentPassword)) throw new AppErrorInvalid('password');
        const value = await getValue(participant.email)
        if(!user && (value?.resetCodes?.code !== passwordInfo.code || passwordInfo.code === undefined )) {
            throw new AppErrorInvalid('code')
        }
        const hashPassword = bcrypt.hashSync(passwordInfo.newPassword, 10)
        return await participant.update({ password: hashPassword })

    },

    async sandCodeChangePassword(email,code, type){
        const participant = await Participant.findOne({
            where: { email: email }
        })
        if(!participant) throw new AppErrorNotExist('email')
        if(type === 0) {
            await resetCode(participant.email, code)
            sendMail(email, 'reset', code);
            return true
        }
        if(type === 1){
            await saveVerificationCode(participant.email, code, 300000)
            sendMail(participant.email, 'registration', code);
        }

        return true
    },

}