import { Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default class FileLink extends Model {
    static initialize(sequelize) {
        FileLink.init(
            { },
            {
                sequelize,
                schema: process.env.NODE_ENV,
                paranoid: true,
                modelName: 'FileLink',
                tableName: 'files_links',
                timestamps: true,
            },
        );

        FileLink.beforeCreate(c => {
            c.id = uuidv4();
        });

    }
}