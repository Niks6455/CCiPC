import {AppErrorMissing} from "../utils/errors.js";
import archiveService from "../services/archive.js";
import typeArchive from '../config/typeArcive.js'
export default {

    async findPhoto(req, res){
        const archives = await archiveService.find(typeArchive.PHOTO)
        res.json(archives)
    },


    async findReport(req,res){
        const archives = await archiveService.find(typeArchive.REPORT)
        res.json(archives)
    },

    async create({body: {name, type, url }}, res){

        if(!name) throw new AppErrorMissing('name')
        if(type === undefined) throw new AppErrorMissing('type')
        if(typeArchive.PHOTO === type && !url) throw new AppErrorMissing('url')
        await archiveService.create({name, url, type })
        res.json({status: 'Ok'})

    },

    async update(req, res){

    },

    async delete(req, res){

    }
}