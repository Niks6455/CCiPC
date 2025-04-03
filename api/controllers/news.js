import {AppErrorMissing} from "../utils/errors.js";
import newsService from "../services/news.js";

export default {
    async create({body: {title, description}}, res){
        if(!title) throw new AppErrorMissing('title')
        if(!description) throw new AppErrorMissing('description')
        const news= await newsService.create(title, description)
        res.json({ news: news });
    },

    async find({query : { year, limit, page }}, res){
        const { currentPage, newsLimit, news }= await newsService.find(year, page, limit)
        res.json({ currentPage: currentPage,  limit: newsLimit, news: news.map(n=>({id: n.id, title: n.title,createdAt: n.createdAt, description: n.description, img: n?.newsFile?.file })) ?? null });
    },


    async findOne({params: { id }}, res){
        if(!id) throw new AppErrorMissing('id')
        const news= await newsService.findOne(id)
        res.json({ news: {id: news.id, title: news.title, createdAt: news.createdAt, description: news.description, img: news?.newsFile?.file},  } );
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