import {AppErrorMissing} from "../utils/errors.js";
import newsService from "../services/news.js";

export default {
    async create({body: {title, description}}, res){
        if(!title) throw new AppErrorMissing('title')
        if(!description) throw new AppErrorMissing('description')
        await newsService.create(title, description)
        res.json({status: 'Ok'});
    },

    async find({query : { year, limit }}, res){
        const { currentPage, newsLimit, news }= await newsService.find({year, limit }, res)
        res.json({ currentPage: currentPage,  limit: limit, news: news });
    },


    async findOne({params: { newsId }}, res){
        if(!newsId) throw new AppErrorMissing('newsId')
        const news= await newsService.findOne(newsId)
        res.json(news);
    },

    async update({params: {newsId}, body:{ title, description }}, res){
        if(!newsId) throw new AppErrorMissing('newsId')
        await newsService.update(newsId, title, description)
        res.json({status: 'Ok'});
    },

    async delete({params: {newsId }}, res){
        if(!newsId) throw new AppErrorMissing('newsId')
        await newsService.delete(newsId)
        res.json({status: 'Ok'});
    },
}