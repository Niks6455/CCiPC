
import {DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import committee from '../config/committee.js';
export default class Committee extends Model {
    static initialize(sequelize) {
        Committee.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true },
                type: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                    defaultValue: 0,
                    validate: { isIn: [Object.values(committee)] },
                },
                fio: {type: DataTypes.STRING, allowNull: false},
                img: {type: DataTypes.STRING, allowNull: true},
                organization: {type: DataTypes.STRING, allowNull: false},
            },
            {
                sequelize,
                schema: process.env.NODE_ENV,
                paranoid: true,
                modelName: 'Committee',
                tableName: 'committees',
                timestamps: true,
            },
        );

        Committee.beforeCreate(c => {
            c.id = uuidv4();
        });

    }
}