import participantService from "../services/participant.js";
import {AppErrorInvalid, AppErrorMissing} from "../utils/errors.js";
import { mapShort, map } from "../utils/mappers/participant.js";

function validateName(name) {
    const nameRegex = /^([a-zA-Zа-яА-ЯёЁ-]+( [a-zA-Zа-яА-ЯёЁ-]+)?)?$/;
    return name.length > 0 && name.length <= 50 && nameRegex.test(name);
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