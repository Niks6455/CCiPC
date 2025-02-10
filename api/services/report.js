import {AppErrorAlreadyExists, AppErrorInvalid, AppErrorNotExist} from "../utils/errors.js";
import Conference from "../models/conference.js";
import Report from "../models/report.js";
import {Op} from "sequelize";
import ParticipantInConference from "../models/participant-in-conference.js";
export default {
    async create( report, participant) {

        const conference = await Conference.findOne({
            where: {
                date: {
                    [Op.gte]: new Date(), // Ищем события, которые происходят сегодня или позже
                },
            },
            order: [['date', 'ASC']], // Сортируем по дате в порядке возрастания
        });

        if(!conference) throw  new AppErrorNotExist('conference')

        const checkReport= await Report.findOne({
            where: {
                name: report.name,
                participantId: participant.id,
                conferenceId:conference.id
            }
        });

        if(checkReport) throw new AppErrorAlreadyExists('name')

        await ParticipantInConference.findOrCreate({
            where: {participantId: participant.id, conferenceId: conference.id},
            defaults: { participantId: participant.id, conferenceId: conference.id },
        })

        return  await Report.create({
            ...report,
            participantId: participant.id,
            conferenceId: conference.id
        })


    },


    async find(participant) {
        return await Report.findAll({
            where: {
                participantId: participant.id
            }
        })
    },

    async findOne(reportId, participant) {
        const report= await Report.findByPk(reportId, {
            where: {participantId: participant.id},

        })

        if(!report) throw new AppErrorInvalid('report')

        return report
    },

    async update(reportInfo, reportId, participant) {
        const report=await Report.findByPk(reportId, {
            where : { participantId: participant.id }
        })

        if(!report) throw new AppErrorInvalid('report')

        return await report.update({ ...reportInfo })
    },

    async delete(reportId, participant) {
        const report=await Report.findByPk(reportId, {
            where : { participantId: participant.id }
        })

        if(!report) throw new AppErrorInvalid('report')

        return await report.delete()
    },


}