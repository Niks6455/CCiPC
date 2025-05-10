import Conference from "../models/conference.js";
import Committee from "../models/committee.js";
import CommitteeInConference from "../models/committee-in-conference.js";
import {AppErrorAlreadyExists, AppErrorInvalid, AppErrorNotExist} from "../utils/errors.js";
import ParticipantInConference from "../models/participant-in-conference.js";
import Participant from "../models/participant.js";
import Report from "../models/report.js";
import {Op } from "sequelize";
import ParticipantOfReport from "../models/participant-of-report.js";
import ExcelJS from 'exceljs';
import Direction from "../models/direction.js";
import DirectionInConference from "../models/direction-in-conference.js";
import File from "../models/file.js";
import FileLink from "../models/file-link.js";
import typesFiles from "../config/typesFiles.js";
import sendMail from "./email.js";
import typesPhoto from '../config/typesPhoto.js';



const invalidChars = /[\\\/\*\?\:\[\]]/g;



export default {

    async find(){
        return await Conference.findAll({
            order: [['createdAt', 'ASC']],
            where:{
                isFinished: false
            },
            include : [{
                    model: CommitteeInConference,
                    as: 'committeeInConference',
                    required: false,
                    group: 'type',
                    include: {
                       model: Committee,
                       as: 'committee',
                       required: false,
                   }
                }, {
                model: Direction,
                as: 'directions',
                required: false,
            },
                {
                    model: FileLink,
                    as: 'filesInConference',
                    required: false,
                    include: {
                        model: File,
                        as: 'file',
                        required: true,
                    }
                }],
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
                {
                    model: Direction,
                    as: 'directions',
                    required: false,
                },
                {
                    model: FileLink,
                    as: 'filesInConference',
                    required: false,
                    include: {
                        model: File,
                        as: 'file',
                        required: true,
                    }
                }
            ],
        });
    },


    async create(conferenceInfo){

        let directions
        if (conferenceInfo?.directions?.length > 0) {
            // Инициализация массива directions
            directions = await Promise.all(conferenceInfo.directions.map(async (direction) => {
                const [foundDirection] = await Direction.findOrCreate({
                    where: {
                        name: direction
                    },
                    defaults: {
                        name: direction
                    }
                });
                return foundDirection; // Возвращаем найденное или созданное направление
            }));

            delete conferenceInfo.directions; // Удаляем directions из conferenceInfo
        }

        const conference = await Conference.create({ ...conferenceInfo });


        if (directions && directions.length > 0) {
            const directionsInConference = await Promise.all(directions.map(async (direction) => {
                const [foundDirectionInConference] = await DirectionInConference.findOrCreate({
                    where: {
                        directionId: direction.id,
                        conferenceId: conference.id,
                    },
                    defaults: {
                        directionId: direction.id,
                        conferenceId: conference.id,
                    }
                });
                return foundDirectionInConference; // Возвращаем найденное или созданное направление в конференции
            }));
        }

        return conference;
    },


    async findParticipants(conferenceId, fio){
        const conference = await Conference.findByPk(conferenceId)
        if(!conference) throw new AppErrorNotExist('conference');

        const parts = fio?.split(' ');

        if(conference.isFinished) return []
        const [surname, name, patronymic] = parts ? parts?.length === 3 ? parts : [parts[1], parts[0], parts[2]] :
            [undefined, undefined, undefined];


         return await Report.findAll({
             where:{
                 conferenceId:conferenceId,
             },
             order: [['createdAt', 'DESC']],
             include: [{
                 model: Direction,
                 as: 'direction',
                 required: false,
             },
                 {
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
             }]
         })

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

        let directions
        if (conferenceInfo?.directions?.length > 0) {
            await DirectionInConference.destroy({
                where: {
                    conferenceId:conference.id,
                },
                include: {
                    model: Direction,
                    as: 'directions',
                    required :true,
                    where: {
                        [Op.notIn]: { name: conferenceInfo.directions }
                    }
                }
            })

            // Инициализация массива directions
            directions = await Promise.all(conferenceInfo.directions.map(async (direction) => {
                const [foundDirection] = await Direction.findOrCreate({
                    where: {
                        name: direction
                    },
                    defaults: {
                        name: direction
                    }
                });
                return foundDirection;
            }));

            delete conferenceInfo.directions;
        }


        if (directions && directions.length > 0) {
            await Promise.all(directions.map(async (direction) => {
                const [foundDirectionInConference] = await DirectionInConference.findOrCreate({
                    where: {
                        directionId: direction.id,
                        conferenceId: conference.id,
                    },
                    defaults: {
                        directionId: direction.id,
                        conferenceId: conference.id,
                    }
                });
                return foundDirectionInConference;
            }));
        }


        if(conferenceInfo?.directionsIds.length > 0) {
            await DirectionInConference.destroy({
                where: {
                    directionId: conferenceInfo.directionsIds,
                    conferenceId: conference.id,
                }
            })
        }

        if (conferenceInfo.deadline ) {
          if (conference?.stages?.length > 0 || conferenceInfo?.stages?.length > 0) {
              const isDeadlineInConferenceInfoStages = conferenceInfo.stages?.some(item => item.date === conferenceInfo.deadline);
              if (!isDeadlineInConferenceInfoStages) {
                  throw new AppErrorInvalid('deadline');
              }
          } else throw new AppErrorInvalid('deadline');
        }

        return await conference.update({ ...conferenceInfo });
    },



    async findFee(conferenceId, fio){
        const conference = await Conference.findByPk(conferenceId)
        if(!conference) throw new AppErrorNotExist('conference');

        if(conference.isFinished) return []

        const parts = fio?.split(' ');

        const [surname, name, patronymic] = parts ? parts?.length === 3 ? parts : [parts[1], parts[0], parts[2]] :
            [undefined, undefined, undefined];

        return await Report.findAll({
            where: {
                conferenceId: conferenceId,
            },
            order: [['createdAt', 'DESC']],
            include: [{
                model: Direction,
                as: 'direction',
                required: false,
            },{
                model: ParticipantOfReport,
                as: 'participantOfReport',
                required: true,
                include: {
                    model: Participant,
                    as: 'participant',
                    required: true,
                    include: [{
                        model: ParticipantInConference,
                        as: 'participantInConference',
                        required: false,
                            },
                            {
                                model: FileLink,
                                as: 'participantFile',
                                required: false,
                                include: {
                                    model: File,
                                    as: 'file',
                                    required: true
                                }
                            }]
                }
            }]
        });



    },

    async assignFee(feeInfo){

        const ids=feeInfo.map(fee=>fee.id)
        const participantInConference = await ParticipantInConference.findAll({
            where: {
                id: {
                    [Op.in]: ids
                }
            },
            include: {
                model: Participant,
                as: 'participant',
                required:true
            }
        })

        if(ids.length !== participantInConference.length) AppErrorNotExist('participantInConference')
        participantInConference.forEach(p=>{
            const foundObject = feeInfo.find(obj => obj.id === p.id);
            if(foundObject.sum >0 ){
                sendMail(p.participant.email, 'assignFee',  `${p.participant?.surname} ${p.participant?.name} ${p.participant?.patronymic ? p.participant?.patronymic : ''}`.trim(), foundObject.sum);
            }
            foundObject.conferenceId=p.conferenceId
            foundObject.participantId=p.participantId
            foundObject.formPay=p.formPay
            foundObject.comment=p.comment
            foundObject.accord=p.accord
            foundObject.receipt=p.receipt
            if (foundObject?.sum === undefined) foundObject.sum = p.sum;
            if (foundObject?.status === undefined) foundObject.status = p.status;

        })
        return await ParticipantInConference.bulkCreate(
            feeInfo,
            {
                updateOnDuplicate: ["sum", "status"],
            })
    },

    async save(conferenceId, type){
        const conference =await Conference.findByPk(conferenceId);
        if(!conference) throw new AppErrorNotExist('conference')

        const reports= await Report.findAll({
            where: {
                conferenceId:conference.id,
            },
            include: {
                model: FileLink,
                as: 'reportFileLink',
                required: true,
                where: {
                    type: typesFiles[type],
                },
                include: {
                    model: File,
                    as: 'file',
                    required:  true,
                    where : {
                        url: { [Op.not]: null }
                    }
                }
            }
        })



       return  reports.map(report=>({path:  report.reportFileLink[0]?.file.url, name : report.name + `.${report.reportFileLink[0]?.file.url.split('.')[1]}`}))

    },

    async savePhotoParticipants(conferenceId){


        const conference =await Conference.findByPk(conferenceId);
        if(!conference) throw new AppErrorNotExist('conference')

        const participants = await ParticipantInConference.findAll({
            where: {
                conferenceId:conferenceId,
            },

            include:{

                    model: Participant,
                    as: 'participant',
                    required: true,
                    include: {
                        model: FileLink,
                        as: 'participantFile',
                        required: true,
                        where: {
                            type: typesPhoto.AVATAR,
                        },
                        include: {
                            model: File,
                            as: 'file',
                            required: true,
                            where: {
                                url: { [Op.not]: null }
                            }
                        }
                    }
            }
        })

        return  participants.map(user=>({
            path:  user.participant.participantFile[0]?.file.url,
            name :  `${user.participant?.surname} ${user.participant?.name} ${user.participant?.patronymic ? user.participant?.patronymic : ''}`.trim() +
              `.${user.participant.participantFile[0]?.file.url.split('.')[1]}`
        }))
    },



    async exportReports(conferenceId) {
        const reports = await Report.findAll({
            where: {
                conferenceId: conferenceId,
            },
            include: [
                {
                    model: Direction,
                    as: 'direction',
                    required: true,
                },
                {
                    model: ParticipantOfReport,
                    as: 'participantOfReport',
                    required: true,
                    include:
                      {
                          model: Participant,
                          as: 'participant',
                          required: true,
                      }
                },

            ],
        });


        const groupedReports = Object.values(reports.reduce((acc, report) => {
            const direction = report.direction.name;

            if (!acc[direction]) {
                acc[direction] = {
                    direction: direction,
                    reports: [],
                    participantCount: 0,
                };
            }

            acc[direction].reports.push(report);
            acc[direction].participantCount += report.participantOfReport.length;

            return acc;
        }, {}));


        const workbook = new ExcelJS.Workbook();

        const data = groupedReports.map(d=>{
            const reports= d.reports.map(d1=>({
               name: d1.name,
               persons: d1.participantOfReport.map(p=>({
                   who: p.who,
                   org: p.organization,
                   email: p.participant.email,
                   academicTitle: p.participant.academicTitle,
                   degree: p.participant.degree,
                   position: p.participant.position,
                   phone: p.participant.phone,
                   status: p.status,
                   form: p.form,
                   fio: `${p.participant.surname} ${p.participant.name} ${p.participant?.patronymic ?? ''}`.trim(),
              })),
            }))
            return { reports: reports,direction: d.direction }
        })




        data.forEach(data1 => {
            let sheetName = data1.direction.replace(invalidChars, '');

            let existingSheet = workbook.getWorksheet(sheetName);
            if (existingSheet) {
                let counter = 1;
                while (workbook.getWorksheet(`${sheetName} (${counter})`)) {
                    counter++;
                }
                sheetName = `${sheetName} (${counter})`;
            }

            const worksheet = workbook.addWorksheet(sheetName);
            worksheet.columns = [
                { header: 'Кто' },
                { header: 'ФИО' },
                { header: 'Организация' },
                { header: 'Почта' },
                { header: 'Телефон' },
                { header: 'Звание' },
                { header: 'Степень' },
                { header: 'Должность' },
                { header: 'Участие' },
                { header: 'Форма' },
                { header: 'Доклад' }
            ];

            let cell=2

            for (const report of data1.reports) {
                const name = report.name
                const rows=report.persons.map(person=>[
                  person.who,
                  person.fio,
                  person.org,
                  person.email,
                  person.phone,
                  person.academicTitle,
                  person.degree,
                  person.position,
                  person.status,
                  person.form,
                  name,
                ])

                worksheet.addRows(rows);
                worksheet.mergeCells(`K${cell}:K${cell+report.persons.length-1}`);
                worksheet.addRow([]);
                cell=cell + report.persons.length+1
            }

        });

        return workbook;

    },

    async finish(conferenceId) {

        const conference = await Conference.findByPk(conferenceId)
        if(!conference) throw new AppErrorNotExist('conference')

        return await conference.update({
            isFinished: true
        })

    }
}