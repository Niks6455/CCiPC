import conferenceService from '../services/conference.js';
import {AppErrorMissing} from "../utils/errors.js";
export default {
    async find(req, res) {
        const conferences = await conferenceService.find();
        res.json(conferences);
    },

    async findOne({params: {conferenceId}}, res) {

        const conference = await conferenceService.findOne(conferenceId);

        res.json(conference);
    },

    async create({body: { number, date, address }, admin }, res) {
        if(!number) throw new AppErrorMissing('number')
        if(!date) throw new AppErrorMissing('date')
        if(!address) throw new AppErrorMissing('address')

        const conference = await conferenceService.create({number, date, address})

        res.json(conference);

    },

    async  findParticipants({params: { conferenceId } }, res) {
        if(!conference) throw new AppErrorMissing('conferenceId')

        const conference =await conferenceService.findParticipants(conferenceId);

        res.json(conference);
    }


}