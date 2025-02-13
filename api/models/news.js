import {DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default class News extends Model {
    static initialize(sequelize) {
        News.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true },
                title: { type: DataTypes.STRING, allowNull: false, unique: 'title' },
                description: { type: DataTypes.TEXT, allowNull: false },
                img: { type: DataTypes.STRING, allowNull: true },
            },
            {
                sequelize,
                schema: process.env.NODE_ENV,
                paranoid: true,
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