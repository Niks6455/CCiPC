import {DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import type from '../config/typeArcive.js'
export default class Archive extends Model {
    static initialize(sequelize) {
        Archive.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true },
                name: {type: DataTypes.STRING, allowNull: false},
                type: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                    validate: { isIn: [Object.values(type)] },
                },
                url: {type: DataTypes.STRING, allowNull: true   },
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