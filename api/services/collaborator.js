import Collaborator from '../models/collaborator.js';
import FileLink from '../models/file-link.js';
import File from '../models/file.js';
import {  AppErrorNotExist } from '../utils/errors.js';
import { Op, Sequelize } from 'sequelize';
export default {

  async create(collaboratorInfo) {

      const checkCollaborator = await Collaborator.findOne({
        where: {
          type: collaboratorInfo.type,
          index: collaboratorInfo.index,
        }
      });

      if (checkCollaborator) {
        await Collaborator.update(
          { index: Sequelize.literal('index + 1') },
          {
            where: {
              type: collaboratorInfo.type,
              index: { [Op.gte]: collaboratorInfo.index },
            },
          }
        );
      }

      return await Collaborator.create({
         index: collaboratorInfo.index,
         url: collaboratorInfo.url,
         type: collaboratorInfo.type,
      });
    },

  async update(collaboratorInfo) {

    const collaborator = await Collaborator.findByPk(collaboratorInfo.id)
    if(!collaborator) throw new AppErrorNotExist('collaborator');

    if(collaboratorInfo.index) {

      const checkCollaborator = await Collaborator.findOne({
        where: {
          type: collaborator.type,
          index: collaboratorInfo.index,
          id: { [Op.not]: collaboratorInfo.id },
        }
      });
      if (checkCollaborator) {

        if(collaboratorInfo.index < collaborator.index) {
          await Collaborator.update(
            { index: Sequelize.literal('index + 1') },
            {
              where: {
                type: collaborator.type,
                index: { [Op.and]: [{ [Op.gte]: collaboratorInfo.index }, { [Op.lt]: collaborator.index }] },
              },
            }
          )
        }
        if(collaboratorInfo.index > collaborator.index) {
          await Collaborator.update(
            { index: Sequelize.literal('index - 1') },
            {
              where: {
                type: collaborator.type,
                index: { [Op.and]: [{ [Op.gte]: collaborator.index }, { [Op.lte]: collaboratorInfo.index }] },
              },
            }
          )
        }

      }
    }

    return await collaborator.update({
      index: collaboratorInfo.index,
      url: collaboratorInfo.url,
    })
  },

  async find(){
     const [ organization,partner ] = await Promise.all([Collaborator.findAll({
       where:{
         type: 0
       },
       order: [['index', 'ASC']],
       include: {
         model: FileLink,
         as: 'collaboratorFile',
         required: true,
         include: {
           model: File,
           as: 'file',
           required: true
         }
       }
     }), Collaborator.findAll({
       where:{
         type: 1
       },
       order: [['index', 'ASC']],
       include: {
         model: FileLink,
         as: 'collaboratorFile',
         required: true,
         include: {
           model: File,
           as: 'file',
           required: true
         }
       }
     })])

    return { organization, partner }
  },

  async findOne(id) {

    return await Collaborator.findByPk(id, {
      include: {
        model: FileLink,
        as: 'collaboratorFile',
        required: true,
        include: {
          model: File,
          as: 'file',
          required: true
        }
      }
    })
  },


  async delete(id) {
    const collaborator = await Collaborator.findByPk(id)
    if(!collaborator) throw  new AppErrorNotExist('collaborator')

    await Collaborator.update(
      { index: Sequelize.literal('index - 1') },
      {
        where: {
          type: collaborator.type,
          index: { [Op.gt]: collaborator.index },
        },
      }
    )
    return await collaborator.destroy()
  }
}