import {AppErrorDuplicate, AppErrorInvalid, AppErrorMissing} from "../utils/errors.js";
import Ajv from 'ajv'
import reportService from "../services/report.js";
import { map } from '../utils/mappers/report.js'
const ajv = new Ajv()


 const schemaCoAuthors = {
     type: "object",
     properties: {
         name: {type: "string"},
         surname: {type: "string"},
         patronymic: {type: "string"},
         email: {type: "string"},
     },

     required: ["name", "surname", "email"],
     additionalProperties: false
}


const validate = ajv.compile(schemaCoAuthors)

function checkValidate(objects) {
    const seenEmails = new Set();

    for (const obj of objects) {

        const email = obj.email;

        const valid = validate(obj);

        if(!valid) throw new AppErrorInvalid('coAuthors')

        if (seenEmails.has(email))
            return false;

        seenEmails.add(email);

    }
    return true; // Дубликатов нет
}
export default {

    async create({body: {name, form, direction, organization, comment, status, coAuthors }, user}, res) {

        if (!name) throw new AppErrorMissing('name')
        if (!form) throw new AppErrorMissing('form')
        if(!direction) throw new AppErrorMissing('direction')
        if(!organization) throw new AppErrorMissing('organization')
        if(!comment) throw new AppErrorMissing('comment')

        if(coAuthors?.length > 0 && !checkValidate(coAuthors)) throw new AppErrorInvalid('coAuthors')

        const  report =await reportService.create({name, form, direction, comment, organization, status , coAuthors}, user)

        res.json({ report: report })
    },

    async update({body: { name, form, direction, status,  comment, coAuthorsIds }, params: { id }, user, admin }, res) {
        if(!id) throw new AppErrorMissing('id')
       const report = await reportService.update({ name, form, direction, comment, coAuthorsIds }, id , user, admin)
        res.json({report: report})
    },

    async delete({params : {  id }, user}, res) {

        if(!id) throw new AppErrorMissing('id')

        await reportService.delete(id, user)

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