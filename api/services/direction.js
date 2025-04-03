import Direction from "../models/direction.js";
import DirectionInConference from "../models/direction-in-conference.js";
import Conference from "../models/conference.js";
import {AppErrorNotExist} from "../utils/errors.js";
import {Op} from "sequelize";

export default {
    async create(name, conferenceId){

        const  conference = await Conference.findByPk(conferenceId);
        if(!conference) throw new AppErrorNotExist('conference')
        const [direction, created]=await Direction.findOrCreate({
            where: {
                name: name
            },
            defaults: {
                name: name
            }
        })

        await DirectionInConference.findOrCreate({
            where: {
                directionId: direction[0].id,
                conferenceId: conference.id,
            },
            defaults: {
                directionId: direction.id,
                conferenceId: conference.id,
            }
        });

        return direction
    },

    async update(name, id){
        const direction = await Direction.findByPk(id);
        if(!direction) throw new AppErrorNotExist('conference')

        const checkDirection = await Direction.findByPk({
            name: name
        });

        if(!checkDirection) return checkDirection;
        return await direction.update({ name: name });
    },

    async find(page= undefined, pageSize=undefined){
        const directions = await Direction.findAll({
            where:{
            },
            ...(pageSize && { limit: pageSize }), // Количество записей на страниц
            ...(page && { offset: (page - 1) * pageSize }), // Смещение для пагинации
            order: [['createdAt', 'DESC']],

        })

        return {
            currentPage: page ?? null,
            directionLimit: pageSize ?? null,
            directions: directions, // Записи новостей для текущей страницы
        };
    },

    async findOne(id){
        const direction = await Direction.findByPk(id);
        if(!direction) throw new AppErrorNotExist('direction')
        return direction
    },

    async deleteOne(id){
        const direction = await Direction.findByPk(id);
        if(!direction) throw new AppErrorNotExist('direction')
        return await direction.destroy()
    },

    async delete(ids){
        return await DirectionInConference.destroy({
            where: {
                directionId: ids
            }
        })
    }
}