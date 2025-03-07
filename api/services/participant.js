import Participant from "../models/participant.js";
import Report from "../models/report.js";
import {AppErrorAlreadyExists, AppErrorNotExist} from "../utils/errors.js";
import sendMail from "./email.js";
import randomCode from "../utils/random-code.js";
import Conference from "../models/conference.js";
import {Op} from "sequelize";
import ParticipantOfReport from "../models/participant-of-report.js";
import fs from "fs";
import ParticipantInConference from "../models/participant-in-conference.js";

export default {

    async   self(participant){


        /*const participantCheck1 = await Conference.findOne({
            where: {
                date: { [Op.gte]: new Date() } // Выбираем конференции с датой >= текущей
            },
            include: [
                {
                    model: ParticipantInConference,
                    as: 'participantInConference',
                    required: false, // Убедимся, что связь обязательна
                    include: {
                        model: Participant,
                        as: 'participant',
                        where: { id: participant.id }, // Фильтруем по ID участника
                        required: true
                    }
                },
                {
                    model: Report,
                    as: 'reports',
                    required: false // Включаем связанные отчеты, если они есть
                }
            ],
            order: [['date', 'ASC']] // Сортируем по дате (ближайшая конференция будет первой)
        });*/



        participant.conference = await Conference.findOne({
                include: [{
                    model: ParticipantInConference,
                    as: 'participantInConference',
                    required: false,
                    where: {
                        participantId: participant.id
                    }
                },{
                    model: Report,
                    as: 'reports',
                    required: false,
                    include: {

                        model: ParticipantOfReport,
                        as: 'participantOfReport',
                        required: true,
                        where: {
                            participantId: participant.id
                        }
                    }
                }],
                order: [['date', 'DESC']]
            });

        return participant

    },

    async update(participantInfo, participantId){

        const participant = await Participant.findByPk(participantId,{
            include: {
                model: ParticipantInConference,
                as: 'participantInConference',
                required: false
            }
        });
        if(!participant) throw new AppErrorNotExist('participant')

        if(participant?.avatar && participantInfo.avatar === null){
             fs.unlink(participant.avatar, (err=> {
                    if (err) console.log(err);
                }))
        }

        if(participant?.participantInConference?.receipt && participantInfo.receipt === null){
            fs.unlink(participant.participantInConference.receipt, (err=> {
                if (err) console.log(err);
            }))
        }


        if(participant?.participantInConference?.accord && participantInfo.accord === null){
            fs.unlink(participant.participantInConference.accord, (err=> {
                if (err) console.log(err);
            }))
        }


        if(participantInfo?.formPay && participant?.participantInConference) await participant?.participantInConference.update({formPay : participantInfo.formPay })

        if(participantInfo.email && participantInfo.email !== participant.email) {

            const checkParticipant = await Participant.findOne({
                where: { email: participantInfo.email },
            })

            if(checkParticipant) throw new AppErrorAlreadyExists('email')

            const code = randomCode(6, '0123456789');

            sendMail(participant.email, 'resetCode', code);

            await  participant.update({ ...participantInfo, activate: false  })
        }

        return await participant.update({...participantInfo});
    },

    async findByEmail(email){
        return await Participant.findOne({
            where: { email }
        })
    },

    async delete(participantId){
        return await Participant.destroy({
            where: {id : participantId}
        })
    }

}