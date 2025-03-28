import Committee from "../models/committee.js";
import Conference from "../models/conference.js";
import {AppErrorNotExist} from "../utils/errors.js";
import CommitteeInConference from "../models/committee-in-conference.js";
import {sequelize} from "../models/index.js";
import FileLink from "../models/file-link.js";
import File from "../models/file.js";
export default {
    async find(conferenceId) {
        const subquery = await CommitteeInConference.findAll({
            attributes: [
                'type',
                [sequelize.fn('COUNT', sequelize.col('CommitteeInConference.id')), 'committee_count']
            ],
            group: ['type'], // Группируем только по 'type'
            raw: true, // Возвращаем "сырые" данные
        });

        const result = await Promise.all(
            subquery.map(async (row) => {
                const relatedData = await CommitteeInConference.findAll({
                    where: { type: row.type },
                    include: [
                        {
                            model: Committee,
                            as: "committee",
                            required: true,
                            order: [['createdAt', 'ASC']],
                            include: {
                                model: FileLink,
                                as: 'committeeFile',
                                required: false,
                                include: {
                                    model: File,
                                    as: 'file',
                                    required: true
                                }
                            }
                        },
                        {
                            model: Conference,
                            as: "conference",
                            required: true,
                            where: {
                               id: conferenceId
                            },
                        },
                    ],
                });
                return { ...row, relatedData };
            })
        );

        return result
    },

    async create(infoCommittee, conferenceId){
        const conference = await Conference.findByPk(conferenceId)

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