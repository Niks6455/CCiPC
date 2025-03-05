import Conference from "../models/conference.js";
import Committee from "../models/committee.js";
import CommitteeInConference from "../models/committee-in-conference.js";
import {AppErrorAlreadyExists, AppErrorInvalid, AppErrorMissing, AppErrorNotExist} from "../utils/errors.js";
import ParticipantInConference from "../models/participant-in-conference.js";
import Participant from "../models/participant.js";
import Report from "../models/report.js";
import {Op} from "sequelize";
import ParticipantOfReport from "../models/participant-of-report.js";
import ExcelJS from 'exceljs';
import {sequelize} from "../models/index.js";
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


    async findParticipants(conferenceId, fio){
        const conference = await Conference.findByPk(conferenceId)
        if(!conference) throw new AppErrorNotExist('conference');

        const parts = fio?.split(' ');

        const [surname, name, patronymic] = parts ? parts?.length === 3 ? parts : [parts[1], parts[0], parts[2]] :
            [undefined, undefined, undefined];


         return await Report.findAll({
             where:{
                 conferenceId:conferenceId,
             },
             order: [['createdAt', 'DESC']],
             include: {
                 model: ParticipantOfReport,
                 as: 'participantOfReport',
                 required: true,
                 include: {
                     model: Participant,
                     as: 'participant',
                     required: true,
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
                 }
             }
         })

         /*conference.participants = await ParticipantInConference.findAll({
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
                group: ['Participant.id', 'ParticipantOfReport.id', 'report.id'], // Указываем группировку
            },
         })*/



        /*const combinedResults = [...conference.participants[0], ...conference.participants[1]];

        const uniqueResults = Array.from(
            new Map(combinedResults.map((item) => [item.id, item])).values()
        );*/


    },

    async update(conferenceInfo, conferenceId){

        if(conferenceInfo.number){
            const checkConference = await Conference.findOne({
                where: { number: conferenceInfo.number },
            })
            if(checkConference) throw new AppErrorAlreadyExists('number conference')
        }

        const conference =await Conference.findByPk(conferenceId)
        if(!conference) throw new AppErrorNotExist('conference')

        if (conferenceInfo.deadline ) {
          if (conference?.stages?.length > 0 || conferenceInfo?.stages?.length > 0) {
              const isDeadlineInStages = conference.stages?.some(item => item.date === conferenceInfo.deadline);
              const isDeadlineInConferenceInfoStages = conferenceInfo.stages?.some(item => item.date === conferenceInfo.deadline);
              if (!isDeadlineInStages && !isDeadlineInConferenceInfoStages) {
                  throw new AppErrorInvalid('deadline');
              }
          } else throw new AppErrorInvalid('deadline');
        }

        return await conference.update({ ...conferenceInfo });
    },

    async findFee(conferenceId, fio){
        const conference = await Conference.findByPk(conferenceId)
        if(!conference) throw new AppErrorNotExist('conference');

        const parts = fio?.split(' ');

        const [surname, name, patronymic] = parts ? parts?.length === 3 ? parts : [parts[1], parts[0], parts[2]] :
            [undefined, undefined, undefined];

        return await Report.findAll({
            where:{
                conferenceId:conferenceId,
            },
            order: [['createdAt', 'DESC']],
            include: {
                model: ParticipantOfReport,
                as: 'participantOfReport',
                required: true,
                include: {
                    model: Participant,
                    as: 'participant',
                    required: true,
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
                        model: ParticipantInConference,
                        as: 'participantInConference',
                        required: true,
                    }
                }
            }
        })

    },

    async assignFee(feeInfo){

        const ids=feeInfo.map(fee=>fee.id)
        const participantInConference = await ParticipantInConference.findAll({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        })

        if(ids.length !== participantInConference.length) AppErrorNotExist('participantInConference')

        participantInConference.forEach(p=>{
            const foundObject = feeInfo.find(obj => obj.id === p.id);
            foundObject.conferenceId=p.conferenceId
            foundObject.participantId=p.participantId
            foundObject.formPay=p.formPay
            foundObject.comment=p.comment
            foundObject.agreement=p.agreement
            foundObject.receipt=p.receipt
            if (foundObject.sum == null) foundObject.sum = p.sum;
            if (foundObject.status == null) foundObject.status = p.status;

        })
        return await ParticipantInConference.bulkCreate(
            feeInfo,
            {
                updateOnDuplicate: ["sum", "status"],
            })
    },

    async save(conferenceId){
        const conference =await Conference.findByPk(conferenceId);
        if(!conference) throw new AppErrorNotExist('conference')

        const reports= await Report.findAll({
            where: {
                conferenceId:conference.id,
                reportFile: {
                    [Op.not]: null
                }
            }
        })

       return  reports.map(report=>({path:  report.reportFile, name : report.name,}))

    },

    async exportReports(conferenceId){


        const reports = await Report.findAll({
            attributes: [
                'direction',
                'name', // Missing comma added here
                [sequelize.fn('COUNT', sequelize.col('Report.id')), 'reportCount']
            ],
            where: {
                conferenceId: conferenceId,
            },
            include: [
                {
                    model: ParticipantOfReport,
                    as: 'participantOfReport',
                    required: true,
                    include: [
                        {
                            model: Participant,
                            as: 'participant',
                            required: true
                        }
                    ]
                }
            ],
            group: ['direction', 'Report.name', 'Report.id', 'participantOfReport.id', 'participantOfReport.participant.id'], // Grouping corrected
        });


        const workbook = new ExcelJS.Workbook();

        reports.forEach(report => {
            const worksheet = workbook.addWorksheet(`${report.direction}`);
            worksheet.columns = [
                { header: 'Кто' },
                { header: 'ФИО' },
                { header: 'Организация' },
                { header: 'Почта' },
                { header: 'Участие' },
                { header: 'Форма' },
                { header: 'Доклад' }
            ];

            // Add rows for participants
            const rows = report.participantOfReport.map(data => [
                data.who,
                `${data.participant.surname} ${data.participant.name} ${data.participant?.patronymic ?? ''}`.trim(),
                data.organization,
                data.participant.email,
                data.status,
                data.form,
                report.name
            ]);
            worksheet.addRows(rows);

            // Merge cells for the "Доклад" column
            worksheet.mergeCells(`G2:G${report.participantOfReport.length + 1}`);
        });

        return workbook
    }
}