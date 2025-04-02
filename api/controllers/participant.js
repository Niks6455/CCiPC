import participantService from "../services/participant.js";
import {AppErrorInvalid, AppErrorMissing} from "../utils/errors.js";
import { mapShort, map } from "../utils/mappers/participant.js";

function validateName(name) {
    const nameRegex = /^([a-zA-Zа-яА-ЯёЁ-]+( [a-zA-Zа-яА-ЯёЁ-]+)?)?$/;
    return name.length > 0 && name.length <= 50 && nameRegex.test(name);
}

function validatePhoneNumber(phone) {
    // Удаляем пробелы и дефисы
    const cleanedPhone = phone.replace(/[\s-]+/g, '');

    // Проверяем, соответствует ли номер формату +7 и 10 цифрам
    const phoneRegex = /^\+7\d{10}$/;

    return phoneRegex.test(cleanedPhone);
}


function validateOrganization(name) {
    // Удаляем пробелы по краям и проверяем, что строка не пустая
    const trimmedName = name.trim();

    // Проверяем, соответствует ли название требованиям
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ0-9.,'"() -]{3,200}$/;

    return trimmedName.length > 0 && nameRegex.test(trimmedName);
}

export default {

    async self({ user }, res){
        const participantSelf = await participantService.self(user);
        res.json({ participant: map(participantSelf) });
    },

    async update({body: {email, name, surname, patronymic, academicTitle, degree, position, organization, phone,formPay}, user}, res){

        if(user.isMicrosoft) {
            if(name || surname || patronymic || organization || email) throw  new AppErrorInvalid('isMicrosoft')
        }

        if(name && !validateName(name)) throw new AppErrorInvalid('name')
        if(surname && !validateName(surname)) throw new AppErrorInvalid('surname')
        if(patronymic && !validateName(patronymic)) throw new AppErrorInvalid('patronymic')

        if(phone && !validatePhoneNumber(phone)) throw new AppErrorInvalid('phone')
        if(organization && !validateOrganization(organization)) throw new AppErrorInvalid('organization')

        if(formPay &&  !['Безналичный', 'Наличный', 'Не выбран'].includes(formPay)) throw  new AppErrorInvalid('formPay')

        const participant = await participantService.update({email, name, surname, patronymic, academicTitle, degree, position, organization, phone, formPay}, user.id)

        res.json({participant});

    },

    async findByEmail({ query }, res){
        if(!query.email) throw new AppErrorMissing('email')
        const participant = await participantService.findByEmail(query.email);
        res.json({ participant : mapShort(participant) ?? null });
    },


    async delete( { user }, res){
        await participantService.delete(user.id)
        res.json({status: 'Ok'});
    }
    
}