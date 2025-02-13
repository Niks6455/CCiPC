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


    async findOne({params: { id }}, res){
        if(!id) throw new AppErrorMissing('id')
        const news= await newsService.findOne(id)
        res.json(news);
    },

    async update({params: {id}, body:{ title, description }}, res){
        if(!id) throw new AppErrorMissing('id')
        await newsService.update(id, title, description)
        res.json({status: 'Ok'});
    },

    async delete({params: {id }}, res){
        if(!id) throw new AppErrorMissing('id')
        await newsService.delete(id)
        res.json({status: 'Ok'});
    },
}