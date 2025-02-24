

import {DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
export default class Archive extends Model {
    static initialize(sequelize) {
        Archive.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true },
                name: {type: DataTypes.STRING, allowNull: false},
                type: {
                    type: DataTypes.ENUM('report', 'photo'),
                    allowNull: false,
                },
                file: {type: DataTypes.STRING, allowNull: false },
                url: {type: DataTypes.STRING, allowNull: false},
            },
            {
                sequelize,
                schema: process.env.NODE_ENV,
                paranoid: true,
                modelName: 'Archive',
                tableName: 'archives',
                timestamps: true,
            },
        );

        Archive.beforeCreate(c => {
            c.id = uuidv4();
        });

    }
}