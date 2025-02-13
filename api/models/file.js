import {DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import typesFiles from "../config/typesFiles.js";
import typesPhoto from '../config/typesPhoto.js';
export default class File extends Model {
    static initialize(sequelize) {
        File.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true },
                name: {type: DataTypes.STRING, allowNull: false },
                url: {type: DataTypes.STRING, allowNull: false },
                mimeType: {type: DataTypes.STRING, allowNull: false },
                size: {type: DataTypes.INTEGER, allowNull: false },
                base64: {type: DataTypes.TEXT, allowNull: true  },
                typeFile: {
                    type: DataTypes.SMALLINT,
                    allowNull: true,
                    validate: { isIn: [Object.values(typesFiles)] },
                },
                typesPhoto: {
                    type: DataTypes.SMALLINT,
                    allowNull: true,
                    validate: { isIn: [Object.values(typesPhoto)] },
                }
            },
            {
                sequelize,
                schema: process.env.NODE_ENV,
                paranoid: true,
                modelName: 'File',
                tableName: 'files',
                timestamps: true,
            },
        );

        File.beforeCreate(c => {
            c.id = uuidv4();
        });

    }
}