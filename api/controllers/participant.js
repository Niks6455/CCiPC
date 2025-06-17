import participantService from "../services/participant.js";
import {AppErrorInvalid, AppErrorMissing} from "../utils/errors.js";
import { mapShort, map } from "../utils/mappers/participant.js";
import validateName from "../utils/validate/name.js";
import validatePhoneNumber from "../utils/validate/phone.js";
import validateOrganization from "../utils/validate/organization.js";

export default {

    async self({ user }, res){
        const participantSelf = await participantService.self(user);
        res.json({ participant: map(participantSelf) });
    },

    async update({body: {email, name, surname, patronymic, academicTitle, degree, position, organization, phone,formPay}, user}, res){

        if(user.isMicrosoft) {
            if(name !== user.name || surname !== user.surname || patronymic !== user.patronymic || email !== user.email || organization !== user.organization) throw  new AppErrorInvalid('isMicrosoft')
        }

        if(name && !validateName(name)) throw new AppErrorInvalid('name')
        if(surname && !validateName(surname)) throw new AppErrorInvalid('surname')
        if(patronymic && !validateName(patronymic)) throw new AppErrorInvalid('patronymic')

        if(position && (position.length < 1 || position.length > 200)) throw new AppErrorInvalid('position')

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