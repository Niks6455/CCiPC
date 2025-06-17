import { AppErrorInvalid, AppErrorMissing } from '../utils/errors.js';
import collaboratorService from "../services/collaborator.js";
const isValidUrl = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

export default {
  async create({body: { url , index, type }}, res){
    if(!index) throw new AppErrorMissing('index');
    if(url && !isValidUrl.test(url)) throw new AppErrorInvalid(url);
    if(type===undefined) throw new AppErrorMissing('type');
    if(type !== 0 && type !== 1) throw new AppErrorInvalid('type');
    const collaborator = await collaboratorService.create({url, index, type});
    res.json({ collaborator: collaborator });
  },

  async find(req, res){
    const { organization , partner }= await collaboratorService.find()
    res.json({ organization: organization.map(org=> ({id: org.id, index: org.index, url: org.url, file: { id: org.collaboratorFile.fileId, url: org.collaboratorFile.file.url } })),
      partner: partner.map(par => ({id: par.id, index: par.index, url: par.url, file: { id: par.collaboratorFile.fileId, url: par.collaboratorFile.file.url}}))});
  },


  async findOne({params: { id }}, res){
    if(!id) throw new AppErrorMissing('id')
    const collaborator= await collaboratorService.findOne(id)
    res.json({ collaborator: {id: collaborator.id, index: collaborator.index, url: collaborator.url, file: { id: collaborator.collaboratorFile.fileId, url: collaborator.collaboratorFile.file.url } } } );
  },

  async update({params: { id }, body:{ url, index }}, res){
    if(url && !isValidUrl.test(url)) throw new AppErrorInvalid('url');
    await collaboratorService.update({ url, index, id })
    res.json({status: 'Ok'});
  },

  async delete({params: {id }}, res){
    if(!id) throw new AppErrorMissing('id')
    await collaboratorService.delete(id)
    res.json({status: 'Ok'});
  },
}