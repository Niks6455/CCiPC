import Archive from "../models/archive.js";
import {AppErrorAlreadyExists, AppErrorNotExist} from "../utils/errors.js";
import FileLink from "../models/file-link.js";
import File from "../models/file.js";

export default {
    async find(type){
        return await Archive.findAll({
            where: {
                type: type
            },
            include: {
              model: FileLink,
              as: 'archiveFile',
              required: false,
              include:{
                  model: File,
                  as: 'file',
                  required: true
              }
            },
            order: [['createdAt', 'DESC']]

        })
    },

    async create(archive){

        const archiveCheck = await Archive.findOne({
            where: {
                name: archive.name,
                type: archive.type
            }
        })

        if(archiveCheck) throw new AppErrorAlreadyExists('archive');
        return await Archive.create({ ...archive })
    },

    async update(archiveInfo, id){

        const archive=await Archive.findByPk(id)
        if(!archive) throw new AppErrorNotExist('archive');
        return await archive.update({...archiveInfo})
    },

    async delete(id){
        const archive = await Archive.findByPk(id)
        if(!archive) throw new AppErrorNotExist('archive');
        return await archive.destroy()
    }
}