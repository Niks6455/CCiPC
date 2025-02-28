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

        res.json({participants: admin ? participants.map(p=>map(p.participant)) : participants.map(p=>mapShort(p.participant))});
    },

    async update({params: { id }, body: {number, date, address, stages, directions  }}, res) {

        if(stages.length > 0 && !checkValidate(stages)) throw new AppErrorInvalid('stages')
        if(directions.length > 0  && new Set(directions).size !== directions.length) throw new AppErrorInvalid('directions')
        if(!id) throw new AppErrorMissing('id')

        await conferenceService.update({number, date, address, stages, directions}, id)

        res.json({status: 'ok'})

    },

    findFee({params: { id }}, res){

    }

}