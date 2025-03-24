import News from "../models/news.js";
import {AppErrorAlreadyExists, AppErrorNotExist} from "../utils/errors.js";
import {Op} from "sequelize";
import fs from "fs";

export default {
    async create(title, description) {

        const news=await News.findOne({
            where: { title: title }

        })

        if(news) throw new AppErrorAlreadyExists('title')

        return await News.create({
            title, description
        })
    },

    async find(year=new Date().getFullYear(), page= undefined, pageSize=undefined){

        const startOfYear = new Date(year, 0, 1); // 1 января текущего года
        const endOfYear = new Date(year, 11, 31, 23, 59, 59); // 31 декабря текущего года

        const news = await News.findAll({
            where:{
                createdAt: {
                    [Op.between]: [startOfYear, endOfYear], // Фильтр по диапазону дат
                },
            },
            ...(pageSize && { limit: pageSize }), // Количество записей на страниц
            ...(page && { offset: (page - 1) * pageSize }), // Смещение для пагинации
            order: [['createdAt', 'DESC']],

        })

        return {
            currentPage: page ?? null,
            newsLimit: pageSize ?? null,
            news: news, // Записи новостей для текущей страницы
        };
    },

    async findOne(id){
        const news=await News.findByPk(id)
        if(!news) throw new AppErrorNotExist('news')
        return news
    },

    async update(id, title, description, img){

        const news= await News.findByPk(id)
        if(title)
        {
            const checkTitle = await News.findOne({
                where: {
                    title: title
                }
            })

            if(checkTitle && news.title !== title) throw new AppErrorAlreadyExists('title')

        }

        if(news?.img && img===null){
                fs.unlink(news.img, (err=> {
                    if (err) console.log(err);
                }))
        }


        if(!news) throw new AppErrorNotExist('news')

        return await news.update({
            title , description, img
        })
    },

    async delete(id){
        const news=await News.findByPk(id);
        if(!news) throw new AppErrorNotExist('news')
        return await news.destroy();
    }
}