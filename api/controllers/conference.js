import conferenceService from '../services/conference.js';
import {AppErrorInvalid, AppErrorMissing} from "../utils/errors.js";
import { mapShort, map } from '../utils/mappers/tableParticipants.js'
import { map as mapConf }  from '../utils/mappers/conference.js'
import Ajv from 'ajv'

const ajv = new Ajv()


const schemaStage = {
    type: "object",
    properties: {
        name: {type: "string"},
        date: {type: "string"},
        type: {type: "number"}
    },

    required: ["name", "date"],
    additionalProperties: false
}


const validate = ajv.compile(schemaStage)

function checkValidate(objects) {
    const seenName = new Set();

    for (const obj of objects) {

        console.log(obj)
        const name = obj.name;

        const valid = validate(obj);

        console.log(valid)
        if(!valid) throw new AppErrorInvalid('stages')

        if (seenName.has(name))
            return false;

        seenName.add(name);
    }
    return true; // Дубликатов нет
}

export default {
    async find(req, res) {
        const conferences = await conferenceService.find();
        res.json(conferences);
    },

    async findOne({params: { id }}, res) {
        if(!id) throw new AppErrorMissing('id')
        const conference = await conferenceService.findOne(id);

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

    async create({body: { number, date, address, stages, directions, deadline }, admin }, res) {
        if(!number) throw new AppErrorMissing('number')
        if(!date) throw new AppErrorMissing('date')
        if(!address) throw new AppErrorMissing('address')

        if(stages.length > 0 && !checkValidate(stages)) throw new AppErrorInvalid('stages')
        if(directions.length > 0 && [...new Set(directions)].length !== directions.length) throw new AppErrorInvalid('directions')

        const conference = await conferenceService.create({number, date, address, stages, directions})

        res.json( { conference: conference } );

    },

    async  findParticipants({params: { id }, query: {limit = 20 , offset = 0, sort, fio }, admin }, res) {
        if(!id) throw new AppErrorMissing('id')

        const participants =await conferenceService.findParticipants(id, fio, admin);

        /*const data = participants.map(p=>p.participant.participantOfReport.map(reports=>({
            reports: reports.report,
            participant: p.participant,
        })))
        console.log(data[1][0].participant)*/

    /*    const data= participants.map(participant => ({
            name: participant.name,
            direction: participant.direction,
            comment: participant.comment,
           participants: participant.participantOfReport.map(p=>p)
        }))

        const name=[]
        const info={}
        const information= data.map(d=> {
            const  person= d.participants.map(d1=>{
                name.push({
                    name: d1.participant.name,
                    surname: d1.participant.surname,
                })
                if(d1.who==='Автор') {
                    info.organization=d1.organization
                    info.status=d1.status
                    info.report = {
                        name: d.name,
                        direction: d.direction,
                        comment: d.comment
                    }
                }

                return info
            })

            return person
        })

        console.log(information)*/



        const data = participants.map(participant => ({
            name: participant.name,
            id:participant.id,
            direction: participant.direction,
            comment: participant.comment,
            participants: participant.participantOfReport.map(p => ({
                name: p.participant.name,
                surname: p.participant.surname,
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

    async update({params: { id }, body: {number, date, address, stages, directions  }}, res) {

        if(stages.length > 0 && !checkValidate(stages)) throw new AppErrorInvalid('stages')
        if(directions.length > 0  && new Set(directions).size !== directions.length) throw new AppErrorInvalid('directions')
        if(!id) throw new AppErrorMissing('id')

        await conferenceService.update({number, date, address, stages, directions}, id)

        res.json({status: 'ok'})

    },

    findFee({ params: { id }}, res ){

    }

}