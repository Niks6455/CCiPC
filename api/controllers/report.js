import { AppErrorInvalid, AppErrorMissing } from "../utils/errors.js";
import reportService from "../services/report.js";
import { map } from '../utils/mappers/report.js'
import statusReport from "../config/status.js";
import formReport from "../config/form.js";
import checkValidate from "../utils/validate/report.js";

export default {

    async create({body: {name, form, organization, comment, status, coAuthors, conferenceId, directionId }, user}, res) {

        if (!name) throw new AppErrorMissing('name')
        if (!form) throw new AppErrorMissing('form')
        if(!directionId) throw new AppErrorMissing('direction')
        if(!organization) throw new AppErrorMissing('organization')
        if(!status) throw new AppErrorMissing('status')
        if(!comment) throw new AppErrorMissing('comment')
        if(!conferenceId) throw new AppErrorMissing('conferenceId')

        if(comment.length > 300) throw new AppErrorInvalid('comment')
        if(organization.length > 200) throw new AppErrorInvalid('organization')
        if(name.length > 300) throw new AppErrorInvalid('name')

        if(!statusReport.includes(status)) throw new AppErrorInvalid('status')
        if(!formReport.includes(form)) throw new AppErrorInvalid('form')
        if(coAuthors?.length > 0 && !checkValidate(coAuthors)) throw new AppErrorInvalid('coAuthors')

        const  report =await reportService.create({name, form, directionId, comment, organization, status , coAuthors}, conferenceId, user)

        res.json({ report: report })
    },

    async update({body: { name, organization, form, status,  comment, coAuthors, coAuthorsIds,directionId }, params: { id }, user }, res) {
        if(!id) throw new AppErrorMissing('id')

        if(comment && comment.length > 300) throw new AppErrorInvalid('comment')
        if(organization && organization.length > 200) throw new AppErrorInvalid('organization')
        if(name && name.length > 300) throw new AppErrorInvalid('name')

        if(status && !statusReport.includes(status)) throw new AppErrorInvalid('status')
        if(form && !formReport.includes(form)) throw new AppErrorInvalid('form')
        if(coAuthors?.length > 0 && !checkValidate(coAuthors)) throw new AppErrorInvalid('coAuthors')
        const report = await reportService.update({ name, form, status, organization, directionId, comment, coAuthors, coAuthorsIds }, id , user)
        res.json({report: report})
    },

    async updateDirections({body: { reportsInfo }, admin }, res){
        const reports = await reportService.updateDirections(reportsInfo)
        res.json({reports: reports})
    },

    async delete({params : {  id }, user, admin}, res) {

        if(!id) throw new AppErrorMissing('id')

        await reportService.delete(id, user ?? admin)

        res.json({status: 'ok'})
    },

    async findOne({params: {id }, user }, res) {
        if(!id) throw new AppErrorMissing('id')

        const report = await reportService.findOne(id, user)
        res.json({report : map(report) } )
    },

    async find({ user }, res) {
        const reports = await reportService.find(user)
        res.json({reports: reports})
    }
}