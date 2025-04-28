import Ajv from "ajv";
import addFormats from "ajv-formats";
import {AppErrorInvalid} from "../errors.js";

const ajv = new Ajv();

addFormats(ajv);

const schemaStage = {
    type: "object",
    properties: {
        name: { type: "string" },
        date: {
            type: "string",
            format: "date"
        },
        type: { type: "number" }
    },
    required: ["name", "date"],
    additionalProperties: false
};

const schemaFee = {
    type: "object",
    properties: {
        sum: { type: "number" },
        status: { type: "boolean" },
        id: { type: "string" },
    },
    required: ["id"],
    additionalProperties: false

}


const validate = ajv.compile(schemaStage)

const validateFee = ajv.compile(schemaFee)

function checkValidate(objects) {
    const seenName = new Set();

    for (const obj of objects) {

        const name = obj.name;

        const valid = validate(obj);

        if(!valid) throw new AppErrorInvalid('stages')

        if (seenName.has(name))
            return false;

        seenName.add(name);
    }
    return true;
}

function checkValidateFee(objects){
    for (const obj of objects) {

        const valid = validateFee(obj);

        if(!valid) throw new AppErrorInvalid('fee')
    }
    return true;
}

export {
    checkValidate,
    checkValidateFee
}