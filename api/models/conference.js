import {DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default class Conference extends Model {
    static initialize(sequelize) {
        Conference.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true },
                number: { type: DataTypes.INTEGER, allowNull: false, unique: 'number' },
                date: { type: DataTypes.DATEONLY, allowNull: false },
                address: { type: DataTypes.STRING, allowNull: false },
                stages: {
                type: DataTypes.ARRAY(DataTypes.JSONB),
                allowNull: true,
                },
                organization: {type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
                partner: {type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
                logo: {type: DataTypes.JSONB, allowNull: true },
                description: {type: DataTypes.TEXT, allowNull: true},
                documents: {type: DataTypes.JSONB, allowNull: true },
                directions: {type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
                deadline: { type: DataTypes.DATEONLY, allowNull: true },

    },
            {
                sequelize,
                schema: process.env.NODE_ENV,
                paranoid: true,
                modelName: 'Conference',
                tableName: 'conferences',
                timestamps: true,
            },
        );

        Conference.beforeCreate(c => {
            c.id = uuidv4();
        });

    }
}