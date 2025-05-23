import News from "../models/news.js";
import { AppErrorNotExist} from "../utils/errors.js";
import {Op} from "sequelize";
import FileLink from "../models/file-link.js";
import File from "../models/file.js";

export default {
    async create(title, description) {
        return await News.create({
            title: title,  description: description
        })
    },

    async find(page= undefined, pageSize=undefined){
        const news = await News.findAll({
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
        return await news.update({ title: title , description: description })
    },

    async delete(id){
        const news=await News.findByPk(id);
        if(!news) throw new AppErrorNotExist('news')
        return await news.destroy();
    }
}