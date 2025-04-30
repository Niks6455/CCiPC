import {AppErrorInvalid} from "../errors.js";


function validateTitle(title) {
  return title.length >= 2 && title.length <= 100
}

function validateDescription(description) {
  return description.length >= 2 && description.length <= 750
}


export default function checkValidate(obj) {

    if(!validateTitle(obj?.title)) throw new AppErrorInvalid('title')
    if(!validateDescription(obj?.description)) throw new AppErrorInvalid('description')


    return true
}

export { validateTitle, validateDescription };
