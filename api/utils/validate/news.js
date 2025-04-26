import {AppErrorInvalid} from "../errors.js";
import Ajv from "ajv";

const ajv = new Ajv()


const schemaNews = {
  type: "object",
  properties: {
    title: {type: "string"},
    description: {type: "string"},
  },

  required: ["title", "description"],
  additionalProperties: false
}


function validateTitle(title) {
  return title.length >= 2 && title.length <= 100
}

function validateDescription(description) {
  return description.length >= 2 && description.length <= 750
}

const validate = ajv.compile(schemaNews)

export default function checkValidate(obj) {

    if(!validateTitle(obj.title)) throw new AppErrorInvalid('title')
    if(!validateDescription(obj.description)) throw new AppErrorInvalid('description')
    const valid = validate(obj);

    if(!valid) throw new AppErrorInvalid('news')

    return true
}
