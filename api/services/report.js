import {AppErrorAlreadyExists, AppErrorInvalid, AppErrorNotExist} from "../utils/errors.js";
import Conference from "../models/conference.js";
import Report from "../models/report.js";
import {Op} from "sequelize";
import ParticipantInConference from "../models/participant-in-conference.js";
import ParticipantOfReport from "../models/participant-of-report.js";
import cache from "../utils/cache.js";
import Participant from "../models/participant.js";
export default {
    async create( reportInfo, participant) {

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
                name: reportInfo.name,
                conferenceId:conference.id
            },
            include: {
                model: ParticipantOfReport,
                as: 'participantOfReport',
                required: true,
                participantId: participant.id,
            }
        });

        if(checkReport) throw new AppErrorAlreadyExists('name')

        await ParticipantInConference.findOrCreate({
            where: {participantId: participant.id, conferenceId: conference.id},
            defaults: { participantId: participant.id, conferenceId: conference.id },
        })

        const report=await Report.create({
            name: reportInfo.name,
            direction: reportInfo.direction,
            comment: reportInfo.comment,
            conferenceId: conference.id
        })



        await ParticipantOfReport.create({
            reportId: report.id,
            participantId: participant.id,
            status: reportInfo.status,
            comment: reportInfo.comment,
            organization: reportInfo.organization,
        })

        if(reportInfo.coAuthors.length > 0){

            const emails =  reportInfo.coAuthors.map(coAuthor => coAuthor?.email)

            const participantsExist = await Participant.findAll({
            where: {
                email: {
                    [Op.in] : emails
                    }
                }
            })


            const participantsExistIds = participantsExist.map(participantExist=> participantExist.id)

            if (participantsExistIds.length > 0) {
                // Create new ParticipantOfReport records for the existing participants
                await ParticipantOfReport.bulkCreate(
                    participantsExistIds.map(participantId => ({
                        reportId: report.id,
                        participantId: participantId,
                        who: 'Соавтор'
                    }))
                );

                const participantInConferencePromises = participantsExistIds.map(participantId => {
                    return ParticipantInConference.findOrCreate({
                        where: {
                            conferenceId: conference.id,
                            participantId: participantId
                        },
                        defaults: {
                            conferenceId: conference.id,
                            participantId: participantId
                        }
                    });
                });

                await Promise.all(participantInConferencePromises);
            }

            let emailsNotInDatabase = []
            if(participantsExist.length> 0){
                const existingEmails = new Set(participantsExist.map(participant => participant.email));
                emailsNotInDatabase = emails.filter(email => !existingEmails.has(email));
            }else{
                emailsNotInDatabase = emails
            }

            emailsNotInDatabase.forEach(email => {
                cache[email]=report.id
            })

        }
        return report
    },


    async find(participant) {
        return await Report.findAll({
           include: {
               model: ParticipantOfReport,
               as: 'participantOfReport',
               required: true,
               where: {
                   participantId: participant.id,
               }
           },
            order: [['createdAt', 'ASC']],
        })
    },

    async findOne(reportId, participant) {
        const report= await Report.findByPk(reportId, {
            include: {
                model: ParticipantOfReport,
                as: 'participantOfReport',
                required: true,
                attributes: ['id', 'form', 'organization', 'who', 'status'],
                include: {
                    model: Participant,
                    as: 'participant',
                    required: true,
                    attributes: ['email', 'name', 'surname', 'patronymic', 'phone'],
                }
            }

        })

        if(!report) throw new AppErrorInvalid('report')

        return report
    },

    async update(reportInfo, reportId, participant) {
        const report=await Report.findByPk(reportId, {
            include: {
                model: ParticipantOfReport,
                as: 'participantOfReport',
                required: true,
                where : { participantId: participant.id }
            }
        })

        if(!report) throw new AppErrorInvalid('report')

        if(report.participantOfReport.who === 'Автор'){
            await report.update({
                name: reportInfo.name,
                direction: reportInfo.direction,
                comment: reportInfo.comment,
            })

            if(reportInfo.coAuthorsIds.length > 0){
                await ParticipantOfReport.destroy({
                    where:{
                        participantId: reportInfo.coAuthorsIds,
                    }
                })
            }
        }

        return await ParticipantOfReport.update({
            organization: reportInfo.organization,
            status: reportInfo.status,
            form: reportInfo.form,
        }, {
            where: {
                participantId: participant.id,
                reportId: report.id,
            }
        })
    },

    async delete(reportId, participant) {
        const report=await Report.findByPk(reportId, {
            include: {
                model: ParticipantOfReport,
                as: 'participantOfReport',
                required: true,
                where : { participantId: participant.id, who: 'Автор' },
            }
        })

        if(!report) throw new AppErrorInvalid('report')

        return await report.destroy()
    },


}