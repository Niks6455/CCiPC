import {AppErrorDuplicate, AppErrorInvalid, AppErrorMissing} from "../utils/errors.js";
import Ajv from 'ajv'
import reportService from "../services/report.js";
import { map } from '../utils/mappers/report.js'
const ajv = new Ajv()
import statusReport from "../config/status.js";
import formReport from "../config/form.js";

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


function validateName(name) {
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ-]{1,50}$/;
    return nameRegex.test(name);
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

const validate = ajv.compile(schemaCoAuthors)

function checkValidate(objects) {
    const seenEmails = new Set();

    for (const obj of objects) {

        const email = obj.email;
        if(!validateName(obj.name)) throw new AppErrorInvalid('name')
        if(!validateName(obj.surname)) throw new AppErrorInvalid('surname')
        if(!validateEmail(email)) throw new AppErrorInvalid('email')
        const valid = validate(obj);

        if(!valid) throw new AppErrorInvalid('coAuthors')

        if (seenEmails.has(email))
            return false;

        seenEmails.add(email);

    }
    return true; // Дубликатов нет
}
export default {

    async create({body: {name, form, organization, comment, status, coAuthors, conferenceId, directionId }, user}, res) {

        if (!name) throw new AppErrorMissing('name')
        if (!form) throw new AppErrorMissing('form')
        if(!directionId) throw new AppErrorMissing('direction')
        if(!organization) throw new AppErrorMissing('organization')
        if(!status) throw new AppErrorMissing('status')
        if(!comment) throw new AppErrorMissing('comment')
        if(!conferenceId) throw new AppErrorMissing('conferenceId')

        if(!statusReport.includes(status)) throw new AppErrorInvalid('status')
        if(!formReport.includes(form)) throw new AppErrorInvalid('form')
        if(coAuthors?.length > 0 && !checkValidate(coAuthors)) throw new AppErrorInvalid('coAuthors')

        const  report =await reportService.create({name, form, directionId, comment, organization, status , coAuthors}, conferenceId, user)

        res.json({ report: report })
    },

    async update({body: { name, organization, form, status,  comment, coAuthors, coAuthorsIds,directionId }, params: { id }, user }, res) {
        if(!id) throw new AppErrorMissing('id')

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