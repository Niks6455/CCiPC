import Conference from "../models/conference.js";
import Committee from "../models/committee.js";
import CommitteeInConference from "../models/committee-in-conference.js";
import {AppErrorAlreadyExists, AppErrorNotExist} from "../utils/errors.js";
import ParticipantInConference from "../models/participant-in-conference.js";
import Participant from "../models/participant.js";
import Report from "../models/report.js";
import {Op} from "sequelize";
import ParticipantOfReport from "../models/participant-of-report.js";
export default {

    async find(){
        return await Conference.findAll({
            order: [['createdAt', 'ASC']],
            include :
                {
                    model: CommitteeInConference,
                    as: 'committeeInConference',
                    required: false,
                    group: 'type',
                    include: {
                       model: Committee,
                       as: 'committee',
                       required: false,
                   }
                }
        })
    },

    async findOne(id){
        return await Conference.findByPk(id, {
            include: [
                {
                    model: CommitteeInConference,
                    as: 'committeeInConference',
                    required: false,
                    include: {
                        model: Committee,
                        as: 'committee',
                        required: false,
                    },
                },
            ],
        });
    },


    async create(conferenceInfo){

        const conference = await Conference.findOne({
            where : {
                number: conferenceInfo.number,
            }
        })

        if(conference) throw new AppErrorAlreadyExists(conferenceInfo.number);

        return await Conference.create({...conferenceInfo});
    },


    async findParticipants(conferenceId, fio, admin){
        const conference = await Conference.findByPk(conferenceId)
        if(!conference) throw new AppErrorNotExist('conference');

        const parts = fio?.split(' ');

        const [surname, name, patronymic] = parts ? parts?.length === 3 ? parts : [parts[1], parts[0], parts[2]] :
            [undefined, undefined, undefined];


         conference.participants = await ParticipantInConference.findAll({
            where: {
                conferenceId:conferenceId,
            },
            include: {
                model: Participant,
                as: 'participant',
                required: false,
                where: {
                        ...(surname && { surname: {[Op.like]: `%${surname}%`}}),
                        ...(name ? [{name: {[Op.like]: `%${name}%`}}] : []),
                        ...(patronymic ? [{patronymic: {[Op.like]: `%${patronymic}%`}}] : []),
                        ...(surname && name
                            ? [
                                {
                                    [Op.and]: [
                                        {surname: {[Op.like]: `%${name}%`}},
                                        {name: {[Op.like]: `%${surname}%`}},
                                    ],
                                },
                            ]
                            : []),
                        ...(surname && patronymic
                            ? [
                                {
                                    [Op.and]: [
                                        {surname: {[Op.like]: `%${patronymic}%`}},
                                        {patronymic: {[Op.like]: `%${surname}%`}},
                                    ],
                                },
                            ]
                            : []),
                        ...(name && patronymic
                            ? [
                                {
                                    [Op.and]: [
                                        {name: {[Op.like]: `%${patronymic}%`}},
                                        {patronymic: {[Op.like]: `%${name}%`}},
                                    ],
                                },
                            ]
                            : []),
                },
                include: {
                    model: ParticipantOfReport,
                    as: 'participantOfReport',
                    required: false,
                    include: {
                        model: Report,
                        as: 'report',
                        required: false
                    }
                },
                group: ['Report.id'],
            },
         })



        /*const combinedResults = [...conference.participants[0], ...conference.participants[1]];

        const uniqueResults = Array.from(
            new Map(combinedResults.map((item) => [item.id, item])).values()
        );*/


        return conference.participants
    },

    async update(conferenceId, conferenceInfo){

        if(conferenceInfo.number){
            const checkConference = await Conference.findOne({
                where: { number: conferenceInfo.number },
            })
            if(checkConference) throw new AppErrorAlreadyExists('number conference')
        }

        const conference =await Conference.findByPk(conferenceId)
        if(!conference) throw new AppErrorNotExist('conference')

        return await conference.update({ ...conferenceInfo });
    }
}