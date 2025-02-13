import Conference from "../models/conference.js";
import News from "../models/news.js";
import Committee from "../models/committee.js";
import CommitteeInConference from "../models/committee-in-conference.js";
import {AppErrorAlreadyExists, AppErrorNotExist} from "../utils/errors.js";
import ParticipantInConference from "../models/participant-in-conference.js";
import Participant from "../models/participant.js";
import Report from "../models/report.js";
export default {

    async find(){
        return await Conference.findAll({
            order: [['date', 'ASC']],
            include :
                {
                   model: Committee,
                   as: 'committees',
                   required: false,
                   include: {
                       model: CommitteeInConference,
                       as: 'committeeInConference',
                       required: false,
                   }
                }
        })
    },

    async findOne(id){
        return await Conference.findByPk(id,
            {
                include:
                    {
                        model: Committee,
                        as: 'committees',
                        required: false,
                        include: {
                            model: CommitteeInConference,
                            as: 'committeeInConference',
                            required: false,
                        }
                    }
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


    async findParticipants(conferenceId){
        const conference = await Conference.findByPk(conferenceId)
        if(!conference) throw new AppErrorNotExist('conference');

        conference.participants=await ParticipantInConference.findAll({
            where: {
                conferenceId:conferenceId,
            },
            include: {
                model: Participant,
                as: 'participant',
                required: true,
                include: {
                    model: Report,
                    as: 'report',
                    required: false,
                    attributes: ['name']
                }
            }
        })

        return conference
    }
}