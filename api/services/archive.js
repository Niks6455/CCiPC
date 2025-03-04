import Archive from "../models/archive.js";
import {AppErrorAlreadyExists, AppErrorNotExist} from "../utils/errors.js";

export default {
    async find(type){
        return await Archive.findAll({
            where: {
                type: type
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