import {AppErrorMissing} from "../utils/errors.js";
import archiveService from "../services/archive.js";
export default {

    async findPhoto(req, res){
        const archives = await archiveService.find('photo')
        res.json(archives)
    },


    async findReport(req,res){
        const archives = await archiveService.find('report')
        res.json(archives)
    }
}