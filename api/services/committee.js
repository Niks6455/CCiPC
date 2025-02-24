import Committee from "../models/committee.js";
import Conference from "../models/conference.js";
import {Op} from "sequelize";
import {AppErrorNotExist} from "../utils/errors.js";
import CommitteeInConference from "../models/committee-in-conference.js";

export default {
    async find(){
        return await CommitteeInConference.findAll({
            include: [
                {
                  model: Committee,
                  as: "committee",
                  required: true,
                },
                {
                model: Conference,
                as: "conference",
                required: true,
                where: {
                    date: {
                        [Op.gte]: new Date(), // Ищем события, которые происходят сегодня или позже
                    },

                },
                order: [['date', 'ASC']], // Сортируем по дате в порядке возрастания
            }]
        })
    },

    async create(infoCommittee){
        const conference = await Conference.findOne({
            where: {
                date: {
                    [Op.gte]: new Date(), // Ищем события, которые происходят сегодня или позже
                },
            },
            order: [['date', 'ASC']], // Сортируем по дате в порядке возрастания
        })

        if(!conference) throw  new AppErrorNotExist('conference')

        const  [committee, created] = await Committee.findOrCreate({
            where: { fio: infoCommittee.fio,  organization: infoCommittee.organization },
            defaults: { fio: infoCommittee.fio, organization: infoCommittee.organization }
        })

        return await CommitteeInConference.findOrCreate({
            where: {committeeId: committee.id, conferenceId: conference.id, type: infoCommittee.type},
            defaults: { committeeId: committee.id, conferenceId: conference.id, type: infoCommittee.type },
        })
    },

    async update(infoCommittee, id){
        const committee = await Committee.findOne({
            include: {
                model: CommitteeInConference,
                as: 'committeeInConference',
                required: true,
                where: {
                    id: id
                }
            }
        });

        if(!committee) throw  new AppErrorNotExist('conference')
        return await committee.update({ ...infoCommittee })
    },

    async delete(id){
        const committee = await CommitteeInConference.findByPk(id)
        if(!committee) throw  new AppErrorNotExist('committee')
        return await committee.destroy()
    }
}