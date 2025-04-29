import {DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default class News extends Model {
    static initialize(sequelize) {
        News.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true },
                title: { type: DataTypes.STRING, allowNull: false },
                description: { type: DataTypes.TEXT, allowNull: false },
            },
            {
                sequelize,
                schema: process.env.NODE_ENV,
                paranoid: false,
                modelName: 'News',
                tableName: 'news',
                timestamps: true,
            },
        );

        News.beforeCreate(c => {
            c.id = uuidv4();
        });

    }
}