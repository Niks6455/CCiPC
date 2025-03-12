import {DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default class Report extends Model {
    static initialize(sequelize) {
        Report.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true },
                name: { type: DataTypes.STRING, allowNull: false, unique: 'name' },
                direction: { type: DataTypes.STRING, allowNull: false },
                comment: { type: DataTypes.STRING, allowNull: false },
                reportFile: { type: DataTypes.STRING, allowNull: true },
                conclusion: { type: DataTypes.STRING, allowNull: true },
            },
            {
                sequelize,
                schema: process.env.NODE_ENV,
                modelName: 'Report',
                tableName: 'reports',
                timestamps: true,
            },
        );

        Report.beforeCreate(c => {
            c.id = uuidv4();
        });

    }
}