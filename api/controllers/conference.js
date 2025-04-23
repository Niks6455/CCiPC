import conferenceService from '../services/conference.js';
import {AppErrorInvalid, AppErrorMissing} from "../utils/errors.js";
import { mapShort, map } from '../utils/mappers/tableParticipants.js'
import { map as mapConf }  from '../utils/mappers/conference.js'
import typesFiles from "../config/typesFiles.js";
import {checkValidateFee} from "../utils/validate/conference.js";
import {checkValidate} from "../utils/validate/conference.js";
import { saveArchive } from '../utils/createArchive.js';
export default {
    async find(req, res) {
        const conferences = await conferenceService.find();

        for(const conference of conferences){
            conference.files = Object.fromEntries(
                Object.entries(
                    conference.filesInConference.reduce((acc, a) => {
                        // Проверяем, существует ли уже тип в аккумуляторе
                        const entry = Object.entries(typesFiles).find(([key, val]) => val === a.type);

                        if (!acc[entry[0]]) {
                            acc[entry[0]] = []; // Если нет, создаем новый массив
                        }
                        // Добавляем файл в соответствующий тип
                        acc[entry[0]].push({
                            id: a.file.id,
                            url: a.file.url,
                            name: a.file.name
                        });
                        return acc; // Возвращаем аккумулятор для следующей итерации
                    }, {}) // Инициализируем аккумулятор как пустой объект
                )
            );
        }

        res.json({ conference: conferences.map(conference=>mapConf(conference))});
    },

    async findOne({params: { id }}, res) {
        if(!id) throw new AppErrorMissing('id')
        const conference = await conferenceService.findOne(id);


        // Получаем файлы конференции и группируем их по типу
        conference.files = Object.fromEntries(
            Object.entries(
                conference.filesInConference.reduce((acc, a) => {
                    // Проверяем, существует ли уже тип в аккумуляторе
                    const entry = Object.entries(typesFiles).find(([key, val]) => val === a.type);

                    if (!acc[entry[0]]) {
                        acc[entry[0]] = []; // Если нет, создаем новый массив
                    }
                    // Добавляем файл в соответствующий тип
                    acc[entry[0]].push({
                        id: a.file.id,
                        url: a.file.url,
                        name: a.file.name
                    });
                    return acc; // Возвращаем аккумулятор для следующей итерации
                }, {}) // Инициализируем аккумулятор как пустой объект
            )
        );

         conference.committee = Object.fromEntries(
            Object.entries(
                conference.committeeInConference.reduce(
                    (acc, a) => {
                        if (!acc[a.type]) {
                            // If not, initialize it as an empty array
                            acc[a.type] = [];
                        }
                        // Push the committee into the array for that type
                        acc[a.type].push({id: a.id, committee: a.committee});
                        return acc;
                    },
                    {}
                )
            )
        );

        res.json({ conference: mapConf(conference)});
    },

    async create({body: { date, address, stages, description, directions, deadline }, admin }, res) {
        if(date?.length < 1) throw new AppErrorInvalid('date')
        date.sort((a, b) => new Date(a) - new Date(b));

        if(!description) throw new AppErrorMissing('description')
        if(!address) throw new AppErrorMissing('address')

        if(stages?.length > 0 && !checkValidate(stages)) throw new AppErrorInvalid('stages')
        if(directions?.length > 0 && [...new Set(directions)].length !== directions.length) throw new AppErrorInvalid('directions')

        if(deadline  && stages?.length > 0){
            const doesNotExist = !stages?.some(item => item.date === deadline);
            if(doesNotExist) throw new AppErrorInvalid('deadline')
        }

        const rangeDate = [ new Date(date[0]), new Date(date[1]) ];
        const conference = await conferenceService.create({ date: rangeDate, address, description, stages, directions, deadline})

        res.json( { conference: conference } );

    },

    async  findParticipants({params: { id }, query: {limit = 20 , offset = 0, sort, fio }, admin }, res) {
        if(!id) throw new AppErrorMissing('id')

        const participants =await conferenceService.findParticipants(id, fio);

        const data = participants.map(participant => ({
            name: participant.name,
            id:participant.id,
            direction: participant?.direction.name,
            comment: participant.comment,
            participants: participant.participantOfReport.map(p => ({
                name: p.participant.name,
                surname: p.participant.surname,
                patronymic: p.participant.patronymic,
                who: p.who,
                organization: p.organization,
                status: p.status,
            })),
        }));



        const information = data.map(d => {
            const reportInfo = {
                report: {
                    name: d.name,
                    direction: d.direction,
                    comment: d.comment,
                    id:d.id,
                },
                organization: null,
                status: null,
                participants: [],
            };

            d.participants.forEach(p => {
                reportInfo.participants.push(
                     `${p.surname} ${p.name} ${p.patronymic ? p.patronymic : ''}`.trim()
                );

                if (p.who === 'Автор') {
                    reportInfo.organization = p.organization;
                    reportInfo.status = p.status;
                }
            });

            return reportInfo;
        });

        res.json({participants: admin ? information.map(p=>map(p)) : information.map(p=>mapShort(p))});
    },

    async update({params: { id }, body: {number, date, address, description, stages, directions, directionsIds, deadline }}, res) {

        if(stages?.length > 0 && !checkValidate(stages)) throw new AppErrorInvalid('stages')
        if(directions?.length > 0  && new Set(directions).size !== directions.length) throw new AppErrorInvalid('directions')
        if(!id) throw new AppErrorMissing('id')
        if(date && date?.length < 1) throw new AppErrorInvalid('date')
        if(date) date.sort((a, b) => new Date(a) - new Date(b));


        const rangeDate = date ? [ new Date(date[0]), new Date(date[1]) ] : [];

        const conference= await conferenceService.update({number, date: rangeDate, address, description, stages, directions, directionsIds, deadline}, id)

        res.json({ conference: conference })

    },

    async findFee({ params: { id }, query: {limit = 20 , offset = 0, sort, fio }, admin }, res ){

        const participants =await conferenceService.findFee(id, fio);

        const data = participants.map(participant => ({
            name: participant.name,
            id:participant.id,
            direction: participant?.direction.name,
            comment: participant.comment,
            participants: participant.participantOfReport.map(p => ({
                name: p.participant.name,
                surname: p.participant.surname,
                patronymic: p.participant.patronymic,
                phone: p.participant.phone,
                email: p.participant.email,
                who: p.who,
                organization: p.organization,
                status: p.status,
                form: p.form,
                participantInConf: p.participant.participantInConference.map(p1=>({
                   status: p1.status,
                   sum: p1.sum,
                   comment: p1.comment,
                   formPay: p1.formPay,
                   id: p1.id
                })),
                accord: p.participant.participantFile.filter(p2=>p2.type === 9),
                receipt: p.participant.participantFile.filter(p2=>p2.type === 10)

            })),
        }));

        const flatArray = data.flatMap(item =>
            item.participants.map(participant => ({
                name: item.name,
                direction: item.direction,
                comment: item.comment,
                organization: participant.organization,
                who: participant.who,
                participationStatus: participant.status,
                form: participant.form,
                fio:`${participant.surname} ${participant.name} ${participant.patronymic ? participant.patronymic : ''}`.trim(),
                email: participant.email,
                phone: participant.phone,
                sum: participant.participantInConf[0].sum,
                formPay: participant.participantInConf[0].formPay,
                status: participant.participantInConf[0].status,
                accord: participant?.accord[0]?.file.url ?? null,
                receipt: participant?.receipt[0]?.file.url ?? null,
                id: participant.participantInConf[0].id,
            }))
        );

        res.json({participants: flatArray})
    },

    async assignFee({ body: { feeInfo } }, res){
        if(!checkValidateFee(feeInfo)) throw new AppErrorInvalid('fee')
        const participantInConference = await conferenceService.assignFee(feeInfo);
        res.json({participantInConference: participantInConference})
    },

    async saveArchive({params: { id }}, res) {
        if(!id) throw new AppErrorMissing('conferenceId')
        const files=await conferenceService.save(id, 'REPORT')
        await saveArchive(files, 'archive', res)
        res.end();
    },

    async saveConclusion({params: { id }}, res) {

      if(!id) throw new AppErrorMissing('conferenceId')
      const files=await conferenceService.save(id, 'CONCLUSION')
      await saveArchive(files, 'conclusion', res)
      res.end();

    },

    async savePhoto({params: { id }}, res) {
      if(!id) throw new AppErrorMissing('conferenceId')
      const files=await conferenceService.savePhotoParticipants(id)
      await saveArchive(files, 'users', res)
      res.end();
    },

    async exportReports({params: { id }}, res){

        const workbook =await conferenceService.exportReports(id)
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=reports.xlsx`);
        await workbook.xlsx.write(res);
        res.end();
    }


}