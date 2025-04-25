
import {DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
export default class Committee extends Model {
    static initialize(sequelize) {
        Committee.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true },
                fio: {type: DataTypes.STRING, allowNull: false},
                organization: {type: DataTypes.STRING, allowNull: false},
            },
            {
                sequelize,
                schema: process.env.NODE_ENV,
                paranoid: false,
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