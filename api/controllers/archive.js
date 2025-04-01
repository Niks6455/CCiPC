import {AppErrorMissing} from "../utils/errors.js";
import archiveService from "../services/archive.js";
import typeArchive from '../config/typeArcive.js'
export default {

    async findPhoto(req, res){
        const archives = await archiveService.find(typeArchive.PHOTO)
        res.json({archives: archives.map(archive=> ({
                id: archive.id,
                name: archive.name,
                type: archive.type,
                url: archive?.url ?? null,
                file: archive.archiveFile?.file ?? null,
            }))})
    },


    async findReport(req,res){
        const archives = await archiveService.find(typeArchive.REPORT)

        res.json({archives: archives.map(archive=> ({
                id: archive.id,
                name: archive.name,
                type: archive.type,
                file: archive.archiveFile?.file ?? null,
            }))})
    },

    async create({body: {name, type, url }}, res){

        if(!name) throw new AppErrorMissing('name')
        if(type === undefined) throw new AppErrorMissing('type')
        if(typeArchive.PHOTO === type && !url) throw new AppErrorMissing('url')
        const archive=await archiveService.create({name, url, type })
        res.json({archive: archive})

    },

    async update({params: { id }, body: { name, type, url } }, res){
        if(!id) throw new AppErrorMissing('id')
        const archive = await archiveService.update({name, url, type }, id)
        res.json({archive: archive})
    },

    async delete({ params: {id } }, res){
        if(!id) throw new AppErrorMissing('id')
        await archiveService.delete(id)
        res.json({ status: 'Ok' })
    }
}