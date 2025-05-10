import {AppErrorAlreadyExists, AppErrorInvalid, AppErrorNotExist} from "../utils/errors.js";
import Conference from "../models/conference.js";
import Report from "../models/report.js";
import {Op} from "sequelize";
import ParticipantInConference from "../models/participant-in-conference.js";
import ParticipantOfReport from "../models/participant-of-report.js";
import cache from "../utils/cache.js";
import Participant from "../models/participant.js";
import sendMail from "./email.js";
import Direction from "../models/direction.js";
import DirectionInConference from "../models/direction-in-conference.js";
import FileLink from "../models/file-link.js";
import File from "../models/file.js";
export default {
    async create( reportInfo, conferenceId, participant) {

        const conference = await Conference.findByPk(conferenceId);

        if(!conference) throw  new AppErrorNotExist('conference')

        const sevenDaysBefore = new Date(conference.deadline);
        sevenDaysBefore.setDate(sevenDaysBefore);
        if (new Date() > sevenDaysBefore) { throw new AppErrorInvalid('date') }

        const direction = await Direction.findByPk(reportInfo.directionId, {
            include: {
                model: DirectionInConference,
                as: 'directionInConference',
                required: true,
                where: {
                    conferenceId: conference.id,
                }
            }
        })

        if(!direction) throw new AppErrorNotExist('direction')


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

        if(reportInfo?.coAuthors?.length > 0) {
            const checkCoAuthors = reportInfo?.coAuthors?.find(coAuthor => coAuthor?.email === participant.email)

            if (checkCoAuthors) throw new AppErrorInvalid('coAuthors')
        }

        await ParticipantInConference.findOrCreate({
            where: {participantId: participant.id, conferenceId: conference.id},
            defaults: { participantId: participant.id, conferenceId: conference.id },
        })

        const report=await Report.create({
            name: reportInfo.name,
            directionId: direction.id,
            comment: reportInfo.comment,
            conferenceId: conference.id,
        })


        await ParticipantOfReport.create({
            reportId: report.id,
            participantId: participant.id,
            status: reportInfo.status,
            comment: reportInfo.comment,
            organization: reportInfo.organization,
            form: reportInfo.form
        })

        if(reportInfo?.coAuthors?.length > 0){

            const emails =  reportInfo.coAuthors.map(coAuthor => coAuthor?.email)

            const checkCoAuthors = reportInfo.coAuthors.find(coAuthor => coAuthor?.email === participant.email)

            if(checkCoAuthors) throw new AppErrorInvalid('coAuthors')

            const participantsExist = await Participant.findAll({
            where: {
                email: {
                    [Op.in] : emails
                    }
                }
            })


            const participantsExistIds = participantsExist.map(participantExist=> participantExist.id)

            if (participantsExistIds.length > 0) {
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
            if(participantsExist?.length> 0){
                const existingEmails = new Set(participantsExist.map(participant => participant.email));
                emailsNotInDatabase = emails.filter(email => !existingEmails.has(email));
            }else{
                emailsNotInDatabase = emails
            }

            emailsNotInDatabase.forEach(email => {
                const person= reportInfo.coAuthors.find(user=>user.email === email)
                if(person){
                    sendMail(email, 'report', `${person?.surname} ${person?.name} ${person?.patronymic ? person?.patronymic : ''}`.trim(), email);
                }
                const reportsIds= cache[email] ?? []
                reportsIds.push(report.id)
                cache[email]=[...new Set(reportsIds)];
            })

        }
        return report
    },

    async updateDirections(reportsInfo){
        const reportsIds= reportsInfo.map(report=> report.id)

        const reports= await Report.findAll({
            where: {
                id: reportsIds
            }
        })

        if(reports.length !== reportsIds.length) throw new AppErrorInvalid('reportsIds')

        reports.forEach(r=>{
            const foundObject = reportsInfo.find(obj => obj.id === r.id);
            foundObject.name=r.name
            foundObject.conferenceId = r.conferenceId
            foundObject.comment=r.comment
        })
        return await Report.bulkCreate(
            reportsInfo,
            {
                updateOnDuplicate: ["directionId"],
            })
    },

    async find(participant) {
        return await Report.findAll({
            order: [['createdAt', 'ASC']],
            include: {
               model: ParticipantOfReport,
               as: 'participantOfReport',
               required: true,
               where: {
                   participantId: participant.id,
               }
           },
        })
    },

    async findOne(reportId, participant) {
        const report= await Report.findByPk(reportId, {
            include: [{
                model: Direction,
                as: 'direction',
                required: false
            },{
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
            },
                {
                    model: FileLink,
                    as: 'reportFileLink',
                    required: false,
                    where: {
                        reportId: reportId,
                    },
                    include: {
                        model: File,
                        as: 'file',
                        required: true
                    }
                }]

        })

        if(!report) throw new AppErrorInvalid('report')

        report.cacheCoAuthors = Object.values(cache)?.flat()?.filter(a=>a === report.id)?.length;


        return report
    },

    async update(reportInfo, reportId, participant) {

        const report = await Report.findByPk(reportId, {
                include: [
                    {
                        model: Direction,
                        as: 'direction',
                        required: false
                    },
                    {
                    model: ParticipantOfReport,
                    as: 'participantOfReport',
                    required: true,
                    where: { participantId: participant.id }
                },
                    {
                        model: Conference,
                        as: 'conference',
                        required: true,
                        where: {
                            deadline: {
                                [Op.gte]:  new Date().toISOString().split('T')[0]
                            }
                        }
                    }
                ]
            })


        if(!report) throw new AppErrorInvalid('deadline')

        if(report.participantOfReport[0].who === 'Автор'){

            if(reportInfo?.directionId){
                const direction = await Direction.findByPk(reportInfo.directionId, {
                    include: {
                        model: DirectionInConference,
                        as: 'directionInConference',
                        required: true,
                        where: {
                            conferenceId: report.conferenceId
                        }
                    }
                })
                if(!direction)  throw  new AppErrorNotExist('direction')
            }

            if(reportInfo?.coAuthors?.length > 0){

                const emails =  reportInfo.coAuthors.map(coAuthor => coAuthor?.email)

                const checkCoAuthors = reportInfo.coAuthors.find(coAuthor => coAuthor?.email === participant.email)

                if(checkCoAuthors) throw new AppErrorInvalid('coAuthors')

                const participantsExist = await Participant.findAll({
                    where: {
                        email: {
                            [Op.in] : emails
                        }
                    }
                })

                const participantsExistIds = participantsExist.map(participantExist=> participantExist.id)

                const checkParticipantOfReport = await ParticipantOfReport.findAll({
                    where: {
                        reportId: report.id,
                        participantId: participantsExistIds,
                    }
                })

                if(checkParticipantOfReport.length > 0) throw new AppErrorAlreadyExists('coAuthor')

                if (participantsExistIds?.length > 0) {
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
                                conferenceId: report.conferenceId,
                                participantId: participantId
                            },
                            defaults: {
                                conferenceId: report.conferenceId,
                                participantId: participantId
                            }
                        });
                    });

                    await Promise.all(participantInConferencePromises);
                }

                let emailsNotInDatabase = []
                if(participantsExist?.length> 0){
                    const existingEmails = new Set(participantsExist.map(participant => participant.email));
                    emailsNotInDatabase = emails.filter(email => !existingEmails.has(email));
                }else{
                    emailsNotInDatabase = emails
                }

                emailsNotInDatabase.forEach(email => {
                    const person= reportInfo.coAuthors.find(user=>user.email === email)
                    if(person){
                        sendMail(email, 'report', `${person?.surname} ${person?.name} ${person?.patronymic ? person?.patronymic : ''}`.trim(), email);
                    }
                    const reportsIds= cache[email] ?? []
                    reportsIds.push(report.id)
                    cache[email]=[...new Set(reportsIds)];
                })

            }

            if(reportInfo?.coAuthorsIds?.length > 0){
                await ParticipantOfReport.destroy({
                    where:{
                        id: reportInfo.coAuthorsIds,
                    }
                })
            }
        }

        await ParticipantOfReport.update({
            organization: reportInfo.organization,
            status: reportInfo.status,
            form: reportInfo.form,
        }, {
            where: {
                participantId: participant.id,
                reportId: report.id,
            }
        })

        await report.update({
            name: reportInfo?.name,
            directionId: reportInfo?.directionId,
            comment: reportInfo?.comment,
        })

        return report

    },

    async delete(reportId, participant) {

        const report = await Report.findByPk(reportId, {
            include: {
                model: ParticipantOfReport,
                as: 'participantOfReport',
                required: true,
                where: participant?.role === 1
                  ? {}
                  : { participantId: participant.id, who: 'Автор' },
            }
        });

        if(!report) throw new AppErrorInvalid('report')


        return await report.destroy()
    },


}