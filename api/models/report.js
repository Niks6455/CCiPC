import {DataTypes, Model, STRING} from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default class Report extends Model {
    static initialize(sequelize) {
        Report.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true },
                name: { type: DataTypes.STRING, allowNull: false, unique: 'name' },
                form: { type: DataTypes.STRING, allowNull: false },
                direction: { type: DataTypes.STRING, allowNull: false },
                comment: { type: DataTypes.STRING, allowNull: false },
                coAuthors: { type: DataTypes.JSON, allowNull: true },
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