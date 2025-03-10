import committeeService from "../services/committee.js";
import {AppErrorInvalid, AppErrorMissing} from "../utils/errors.js";
import committeeType from "../config/committee.js";
import { map } from '../utils/mappers/committee.js'
export default {

    async find({query: { conferenceId }},res){
        if(!conferenceId) throw  new AppErrorMissing('conferenceId')
        const committee=await committeeService.find(conferenceId)
        res.json({committee: committee.map(c=> map(c))})
    },

    async create({ body: {fio, organization, type, conferenceId } },res){
        if(!fio) throw new AppErrorMissing('fio')
        if(!conferenceId) throw new AppErrorMissing('conferenceId')
        if(!organization) throw new AppErrorMissing('organization')
        if(type === undefined) throw new AppErrorMissing('type')
        if(!Object.values(committeeType).includes(type)) throw new AppErrorInvalid('type')
        const committee = await committeeService.create({fio, organization, type})
        res.json({committee: committee});
    },

    async update({params: { id }, body: { fio, organization, img } },res){
        if(!id) throw new AppErrorMissing('id')
        const committee=await committeeService.update({fio, organization, img}, id)
        res.json({committee: committee});
    },

    async delete({params: { id } }, res){
        if(!id) throw new AppErrorMissing('id')
        await committeeService.delete(id);
        res.json({status: 'Ok'});
    }
}