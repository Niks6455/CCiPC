import Participant from "../models/participant.js";
import Report from "../models/report.js";
import { AppErrorAlreadyExists, AppErrorInvalid, AppErrorNotExist } from '../utils/errors.js';
import sendMail from "./email.js";
import randomCode from "../utils/random-code.js";
import Conference from "../models/conference.js";
import ParticipantOfReport from "../models/participant-of-report.js";
import ParticipantInConference from "../models/participant-in-conference.js";
import FileLink from "../models/file-link.js";
import File from "../models/file.js";
import typesFiles from "../config/typesFiles.js";
import typesPhoto from "../config/typesPhoto.js";
import roles from '../config/roles.js';
export default {

    async   self(participant){

        participant.conference = await Conference.findOne({
            where: {  isFinished: false },
                include: [{
                    model: ParticipantInConference,
                    as: 'participantInConference',
                    required: false,
                    where: {
                        participantId: participant.id,
                    }
                },{
                    model: Report,
                    as: 'reports',
                    required: false,
                    order: [['createdAt', 'ASC']],
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

        const files = await FileLink.findAll({
            where: {
                participantId: participant.id
            },
            include: [{
                model: File,
                as: 'file',
                required: true
            },
                {
                    model:Conference,
                    as: 'conference',
                    required: false,
                    where: {
                        isFinished: false
                    }
                }]
        })


        participant.avatar= files.filter(f=>f.type === typesPhoto.AVATAR)
        participant.receipt= files.filter(f=>f.type === typesFiles.RECEIPT && f.conference)
        participant.accord= files.filter(f=>f.type === typesFiles.AGREEMENT && f.conference)


        return participant

    },

    async update(participantInfo, participantId){

        const participant = await Participant.findByPk(participantId,{
            include: {
                model: ParticipantInConference,
                as: 'participantInConference',
                required: false,
                include: {
                    model: Conference,
                    as: 'conference',
                    required: true,
                    where: {
                        isFinished: false
                    }
                }
            }
        });
        if(!participant) throw new AppErrorNotExist('participant')


        if(participantInfo?.formPay && participant?.participantInConference) await participant?.participantInConference[0].update({formPay : participantInfo.formPay })

        if(participantInfo?.phone && participantInfo.phone !== participant.phone){
            const checkPhone = await Participant.findOne({
                where: { phone: participantInfo.phone },
            })
            if(checkPhone) throw new AppErrorAlreadyExists('phone')

        }
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
            where: {
                email,
                role: roles.USER
            }
        })
    },

    async delete(participantId){

        const participantInConference = await ParticipantInConference.findAll({
            where: {
                participantId: participantId
            },
            include:[{
                model: Conference,
                as: 'conference',
                required: true,
                where: {
                    isFinished: false
                }
            },
                {
                    model:Participant,
                    as: 'participant',
                    required: true,
                    include: {
                        model: ParticipantOfReport,
                        as: 'participantOfReport',
                        required: true,
                        where: {
                            participantId: participantId,
                        }
                    }
                }
            ]
        })

        if(participantInConference.length > 0)  throw new AppErrorInvalid('participant in conference not finished')

        return await Participant.destroy({
            where: {id : participantId}
        })
    }

}