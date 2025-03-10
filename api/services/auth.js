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
import qs from "querystring";
import sync from '../utils/sync.js'
import axios from "axios";
import {Op} from "sequelize";
const verificationCodes= {};
const resetCodes= {};

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

        verificationCodes[participant.email] = code

        sendMail(participant.email, 'registration', code);

        return  await Participant.create({
            ...participant,
            password: participant.hashPassword
        })
    },

    async loginSfedu(code, code_verifier){

        let accessToken;
        try {
            // Обмен кода на токен доступа у Microsoft Azure
            const { data } = await axios.post(
                'https://login.microsoftonline.com/19ba435d-e46c-436a-84f2-1b01e693e480/oauth2/v2.0/token',
                qs.stringify({
                    client_id: process.env.SFEDU_ID,
                    client_secret: process.env.SFEDU_SECRET,
                    scope: 'openid',
                    code,
                    code_verifier,
                    redirect_uri: `${process.env.WEB_URL}/login`,
                    grant_type: 'authorization_code',
                })
            );

            accessToken = data.access_token;
        } catch (e) {
            throw new AppErrorInvalid('code');
        }
        // Получение почты и имени пользователя из токена
        const { unique_name: email, name } = jwt.decode(accessToken);



        const participant=await Participant.findOne({
            where: { email: email }
        })

        if(participant) {
            const { jwt: token } = jwt.generate({ id: participant.id });
            return { token, participant };
        }


/*


        try {

            const {data: {student: studentInfo}} = await sync.get(`/students/tro@sfedu.ru`);
            return studentInfo

        } catch (e){
            console.log(e.message)
        }*/
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