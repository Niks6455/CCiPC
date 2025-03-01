import participantService from "../services/participant.js";
import {AppErrorInvalid, AppErrorMissing} from "../utils/errors.js";
import { mapShort, map } from "../utils/mappers/participant.js";

export default {

    async self({ user }, res){
        user.reports = (await participantService.self(user))?.reports;
        res.json({ participant: map(user) });
    },

    async update({body: {email, name, surname, patronymic, academicTitle, degree, position, organization, phone, avatar}, user}, res){

        if(user.isMicrosoft) {
            if(name || surname || patronymic || organization || email) throw  new AppErrorInvalid('isMicrosoft')
        }
        const participant = await participantService.update({email, name, surname, patronymic, academicTitle, degree, position, organization, phone, avatar}, user.id)

        res.json({participant});

    },

    async findByEmail({ query }, res){
        if(!query.email) throw new AppErrorMissing('email')
        const participant = await participantService.findByEmail(query.email);
        res.json({ participant : mapShort(participant) });
    },


    async delete( { user }, res){
        await participantService.delete(user.id)
        res.json({status: 'Ok'});
    }
    
}