import {AppErrorInvalid} from "../errors.js";
import Ajv from "ajv";

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


function validateName(name) {
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ-]{1,50}$/;
    return nameRegex.test(name);
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

const validate = ajv.compile(schemaCoAuthors)

export default function checkValidate(objects) {
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
