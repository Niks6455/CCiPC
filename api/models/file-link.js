import {DataTypes, Model} from 'sequelize';

export default class FileLink extends Model {
    static initialize(sequelize) {
        FileLink.init(
            {
                type: { type: DataTypes.SMALLINT, allowNull: false },
            },
            {
                sequelize,
                schema: process.env.NODE_ENV,
                modelName: 'FileLink',
                tableName: 'files_links',
                timestamps: false,
            }
        )
    }
}