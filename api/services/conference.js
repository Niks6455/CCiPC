import Conference from "../models/conference.js";
import Committee from "../models/committee.js";
import CommitteeInConference from "../models/committee-in-conference.js";
import {AppErrorAlreadyExists, AppErrorInvalid, AppErrorMissing, AppErrorNotExist} from "../utils/errors.js";
import ParticipantInConference from "../models/participant-in-conference.js";
import Participant from "../models/participant.js";
import Report from "../models/report.js";
import {Op, Sequelize} from "sequelize";
import ParticipantOfReport from "../models/participant-of-report.js";
import ExcelJS from 'exceljs';
import {sequelize} from "../models/index.js";
import typesPhoto from "../config/typesPhoto.js";
import fs from "fs";
import typesFiles from "../config/typesFiles.js";
import Direction from "../models/direction.js";
import DirectionInConference from "../models/direction-in-conference.js";

async function deleteFile(filePath) {
    try {
        await fs.promises.unlink(filePath);
        console.log(`Файл удален: ${filePath}`);
    } catch (err) {
        console.error(`Ошибка при удалении файла: ${filePath}`, err);
    }
}

// Функция для обработки JSON полей (logo, documents)
async function processJsonField(conference, conferenceInfo, fieldName, types, validTypes) {
    if (conference?.[fieldName] && conferenceInfo?.[fieldName]) {
        for (const [key, value] of Object.entries(conferenceInfo[fieldName])) {
            if (validTypes.includes(types[key]) && value === null) {
                await deleteFile(conference[fieldName][key]);
                delete conference[fieldName][key];
                conference.changed(fieldName, true);
            }
        }
        await conference.save();
    }
}

// Функция для обработки массивов (organization, partner)
async function processArrayField(conference, conferenceInfo, fieldName) {
    if (conference?.[fieldName] && conferenceInfo?.[fieldName]) {

        const filesToKeep = new Set(conferenceInfo[fieldName]);

        for (const file of conference[fieldName]) {
            if (filesToKeep.has(file)) {
                await deleteFile(file);
            }
        }

            const updatedFiles = conference[fieldName].filter(file => !filesToKeep.has(file));

            await conference.update({[fieldName]: updatedFiles});
            conference.changed(fieldName, true);
            await conference.save();

            delete conferenceInfo?.[fieldName];

    }
}

export default {

    async find(){
        return await Conference.findAll({
            order: [['createdAt', 'ASC']],
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

        await processJsonField(conference, conferenceInfo, 'logo', typesPhoto, [4, 5]);

        // Обработка поля documents
        await processJsonField(conference, conferenceInfo, 'documents', typesFiles, [5, 6, 7, 8]);

        // Обработка поля organization
        await processArrayField(conference, conferenceInfo, 'organization');

        // Обработка поля partner
        await processArrayField(conference, conferenceInfo, 'partner');

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

       return  await Report.findAll({
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
                    include: {
                        model: ParticipantInConference,
                        as: 'participantInConference',
                        required: false,
                    }
                }
            }]
        });

// Проверка результата выборки


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
            foundObject.accord=p.accord
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
            where: {
                conferenceId: conferenceId, // Фильтр по conferenceId
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
                }
            ],
            group: ['direction.id', 'Report.id', 'participantOfReport.id','participantOfReport.participant.id'], // Группировка по directionId
            attributes: {
                include: [
                    [sequelize.fn('COUNT', sequelize.col('participantOfReport.participant_id')), 'participantCount'], // Подсчет участников
                    [sequelize.fn('COUNT', sequelize.col('Report.id')), 'reportCount'] // Подсчет докладов
                ]
            }
        });


// Группировка отчетов по направлению
     /*   const groupedReports = reports.reduce((acc, report) => {
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
        }, {});*/

// Преобразуем объект в массив

        const workbook = new ExcelJS.Workbook();

        reports.forEach(report => {
            let sheetName = report.direction.name;

            // Проверка на существование листа и создание уникального имени
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
                { header: 'Участие' },
                { header: 'Форма' },
                { header: 'Доклад' }
            ];


            // Подготовка строк для участников
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

            // Объединение ячеек для колонки "Доклад"
            worksheet.mergeCells(`G2:G${report.participantOfReport.length + 1}`);
        });

        return workbook;
        }
}