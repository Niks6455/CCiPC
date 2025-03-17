import {AppErrorMissing} from "../utils/errors.js";
import directionService from "../services/direction.js";
export default {
    async create({body: { name, conferenceId }}, res){
        if(!name) throw new AppErrorMissing('name')
        if(!conferenceId) throw new AppErrorMissing('conferenceId')

        const  direction = await directionService.create(name, conferenceId)
        res.json({direction: direction});
    },

    async update({params: { id }, body: { name }}, res){
        if(id) throw new AppErrorMissing('id')
        const direction = await directionService.update(name, id);
        res.json({direction: direction});
    },

    async find({query : {limit, page }}, res){
        const { currentPage, directionLimit, directions }= await directionService.find(page, limit)
        res.json({ currentPage: currentPage,  limit: directionLimit, directions: directions });
    },

    async findOne({params: { id }}, res){
        if(!id) throw new AppErrorMissing('id')
        const direction = await directionService.findOne(id)
        res.json({direction: direction});
    },

    async delete({params: { id }}, res){
        if(!id) throw new AppErrorMissing('id')
        await directionService.delete(id)
        res.json({status: 'Ok'});
    }
}