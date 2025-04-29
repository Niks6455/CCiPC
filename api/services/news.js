import News from "../models/news.js";
import {AppErrorAlreadyExists, AppErrorNotExist} from "../utils/errors.js";
import {Op} from "sequelize";
import FileLink from "../models/file-link.js";
import File from "../models/file.js";

export default {
    async create(title, description) {
        return await News.create({
            title, description
        })
    },

    async find(year=new Date().getFullYear(), page= undefined, pageSize=undefined){

        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31, 23, 59, 59);

        const news = await News.findAll({
            where:{
                createdAt: {
                    [Op.between]: [startOfYear, endOfYear],
                },
            },
            ...(pageSize && { limit: pageSize }),
            ...(page && { offset: (page - 1) * pageSize }),
            order: [['createdAt', 'DESC']],
            include: {
                model: FileLink,
                as: 'newsFile',
                required: false,
                include: {
                    model: File,
                    as: 'file',
                    required: true
                }
            }
        })

        return {
            currentPage: page ?? null,
            newsLimit: pageSize ?? null,
            news: news,
        };
    },

    async findOne(id){
        const news=await News.findByPk(id,
            {
                include: {
                    model: FileLink,
                    as: 'newsFile',
                    required: false,
                    include: {
                        model: File,
                        as: 'file',
                        required: true
                    }
                }
            })
        if(!news) throw new AppErrorNotExist('news')
        return news
    },

    async update(id, title, description){

        const news= await News.findByPk(id)
        if(!news) throw new AppErrorNotExist('news')

        return await news.update({
            title , description
        })
    },

    async delete(id){
        const news=await News.findByPk(id);
        if(!news) throw new AppErrorNotExist('news')
        return await news.destroy();
    }
}