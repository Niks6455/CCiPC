import committeeService from "../services/committee.js";
import {AppErrorInvalid, AppErrorMissing} from "../utils/errors.js";
import committee from "../config/committee.js";
import { map } from '../utils/mappers/committee.js'
export default {

    async find(req,res){
        const committee=await committeeService.find()
        res.json({"committee": committee.map(c=> map(c))})
    },

    async create({ body: {fio, organization, type } },res){
        if(!fio) throw new AppErrorMissing('fio')
        if(!organization) throw new AppErrorMissing('organization')
        if(type === undefined) throw new AppErrorMissing('type')
        if(!Object.values(committee).includes(type)) throw new AppErrorInvalid('type')
        const committee = await committeeService.create({fio, organization, type})
        res.json({committee: committee});
    },

    async update({params: { id }, body: { fio, organization } },res){
        if(!id) throw new AppErrorMissing('id')
        const committee=await committeeService.update({fio, organization}, id)
        res.json({committee: committee});
    },

    async delete({params: { id } }, res){
        if(!id) throw new AppErrorMissing('id')
        await committeeService.delete(id);
        res.json({status: 'Ok'});
    }
}