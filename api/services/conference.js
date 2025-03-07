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
import typesPhoto from "../config/typesPhoto.js";
import fs from "fs";
import typesFiles from "../config/typesFiles.js";


async function deleteFile(filePath) {
    try {
        await fs.unlink(filePath);
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
        const files = new Set([...conference[fieldName], ...conferenceInfo[fieldName]]);
        for (const file of files) {
            await deleteFile(file);
        }
        await conference.update({ [fieldName]: conferenceInfo[fieldName] });
        conference.changed(fieldName, true);
        await conference.save();
    }
}


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


        /*if(conference?.logo && conferenceInfo?.logo) {
            for (const [key, value] of Object.entries(conferenceInfo.logo)) {
                if(typesFiles[key] === 4 || typesPhoto[key] === 5) {
                    if(value === null){
                        fs.unlink(conference.logo[conferenceInfo.logo], (err=> {
                            if (err) console.log(err);
                        }))
                        delete conference.logo[key]; // Замените jsonField на имя вашего поля
                        conference.changed('logo', true);
                        // Сохраняем изменения
                        await conference.save();
                    }
                }
            }
        }

        if(conference?.documents && conferenceInfo?.documents ) {
            for (const [key, value] of Object.entries(conferenceInfo.documents)) {
                if(typesFiles[key] === 5 || typesFiles[key] === 6 || typesFiles[key] === 7 || typesFiles[key] === 8) {
                    if(value === null){
                        fs.unlink(conference.documents[conferenceInfo.documents], (err=> {
                            if (err) console.log(err);
                        }))
                        delete conference.documents[key]; // Замените jsonField на имя вашего поля
                        conference.changed('documents', true);
                        // Сохраняем изменения
                        await conference.save();
                    }
                }
            }
        }

        if(conference?.organization && conferenceInfo?.organization ) {

            const files= new Set([...conference.organization, ...conferenceInfo?.organization]);

            for (const file of files) {
                fs.unlink(file, (err=> {
                    if (err) console.log(err);
                }))
            }

            await conference.update({organization: conferenceInfo.organization })
            conference.changed('organization', true);

            await conference.save();


        }

        if(conference?.partner && conferenceInfo?.partner ) {

            const files= new Set([...conference.partner, ...conferenceInfo?.partner]);

            for (const file of files) {
                fs.unlink(file, (err=> {
                    if (err) console.log(err);
                }))
            }

            await conference.update({partner: conferenceInfo.partner })
            conference.changed('partner', true);

            await conference.save();


        }*/

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