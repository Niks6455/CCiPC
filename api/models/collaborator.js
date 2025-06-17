
import {DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
export default class Collaborator extends Model {
  static initialize(sequelize) {
    Collaborator.init(
      {
        id: { type: DataTypes.UUID, primaryKey: true },
        index: { type: DataTypes.SMALLINT, allowNull: false },
        type: { type: DataTypes.SMALLINT,   validate: {
            isIn: [[0, 1]]
          }},
        url: { type: DataTypes.STRING, allowNull: true },
      },
      {
        sequelize,
        schema: process.env.NODE_ENV,
        paranoid: false,
        modelName: 'Collaborator',
        tableName: 'collaborators',
        timestamps: true,
      },
    );

    Collaborator.beforeCreate(c => {
      c.id = uuidv4();
    });

  }
}