import Participant from "../models/participant.js";
import Report from "../models/report.js";
import {AppErrorAlreadyExists, AppErrorNotExist} from "../utils/errors.js";
import sendMail from "./email.js";
import randomCode from "../utils/random-code.js";
import Conference from "../models/conference.js";
import {Op} from "sequelize";
import ParticipantInConference from "../models/participant-in-conference.js";
import ParticipantOfReport from "../models/participant-of-report.js";

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



        const [lastConference, nextConference] = await Promise.all([
            Conference.findOne({
                where: {
                    date: { [Op.lt]: new Date() },
                },
                include: {
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
                },
                order: [['date', 'DESC']]
            }),
            Conference.findOne({
                where: {
                    date: { [Op.gte]: new Date() }
                },
                include: {
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
                },
                order: [['date', 'ASC']]
            })
        ]);

        if(nextConference.reports ) return nextConference
        return lastConference

    },

    async update(participantInfo, participantId){

        const participant = await Participant.findByPk(participantId);
        if(!participant) throw new AppErrorNotExist('participant')


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