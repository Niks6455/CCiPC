import Archive from "../models/archive.js";

export default {
    async find(type){
        return await Archive.findAll({
            where: {
                type: type
            }
        })
    },

    async create(archive){
        return await Archive.create(...archive)
    }
}