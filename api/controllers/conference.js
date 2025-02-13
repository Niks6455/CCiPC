import conferenceService from '../services/conference.js';
import {AppErrorMissing} from "../utils/errors.js";
export default {
    async find(req, res) {
        const conferences = await conferenceService.find();
        res.json(conferences);
    },

    async findOne({params: { id }}, res) {
        if(!id) throw new AppErrorMissing('id')
        const conference = await conferenceService.findOne(id);

        res.json(conference);
    },

    async create({body: { number, date, address }, admin }, res) {
        if(!number) throw new AppErrorMissing('number')
        if(!date) throw new AppErrorMissing('date')
        if(!address) throw new AppErrorMissing('address')

        const conference = await conferenceService.create({number, date, address})

        res.json(conference);

    },

    async  findParticipants({params: { id } }, res) {
        if(!id) throw new AppErrorMissing('id')
        if(!conference) throw new AppErrorMissing('conferenceId')

        const conference =await conferenceService.findParticipants(id);

        res.json(conference);
    }


}