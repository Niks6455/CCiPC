import {DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default class File extends Model {
    static initialize(sequelize) {
        File.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true },
                url: { type: DataTypes.STRING, allowNull: false },
                name: { type: DataTypes.STRING, allowNull: false },
            },
            {
                sequelize,
                schema: process.env.NODE_ENV,
                paranoid: false,
                modelName: 'File',
                tableName: 'files',
            },
        );

        File.beforeCreate(c => {
            c.id = uuidv4();
        });

    }
}