import participantService from "../services/participant.js";
import { AppErrorMissing} from "../utils/errors.js";
import { mapShort, map } from "../utils/mappers/participant.js";

export default {

    async self({ user }, res){

        user.reports = (await participantService.self(user))?.reports;
        res.json({participant: map(user) });
    },

    async update({body: {email, password, name, surname, patronymic, academicTitle, degree, position, organization, phone}, user}, res){


        const participant = await participantService.update({email, password, name, surname, patronymic, academicTitle, degree, position, organization, phone})

        res.json({participant});

    },

    async findByEmail({ query }, res){
        if(!query.email) throw new AppErrorMissing('email')
        const participant = await participantService.findByEmail(query.email);
        res.json({ participant : mapShort(participant) });
    }
    
}