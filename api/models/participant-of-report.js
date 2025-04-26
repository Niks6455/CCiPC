import {DataTypes, Model} from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default class ParticipantOfReport extends Model {
    static initialize(sequelize) {
        ParticipantOfReport.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true },
                organization: { type: DataTypes.STRING(200), allowNull: true },
                status: { type: DataTypes.ENUM('Участник', 'Студент', 'Аспирант', 'Не выбрано'), allowNull: false, defaultValue: 'Не выбрано' },
                form: { type: DataTypes.ENUM('Очно', 'Заочно', 'Не выбрано'), allowNull: false, defaultValue: 'Не выбрано' },
                who: {type: DataTypes.ENUM('Автор', 'Соавтор'), allowNull: false, defaultValue: 'Автор' },

            },
            {
                sequelize,
                schema: process.env.NODE_ENV,
                modelName: 'ParticipantOfReport',
                tableName: 'participant-of-report',
                timestamps: false,
            }
        );

        ParticipantOfReport.beforeCreate(c => {
            c.id = uuidv4();
        });

        ParticipantOfReport.beforeBulkCreate(c=>{
            for (const participantOfReport of c) {
                participantOfReport.id=uuidv4()
            }
        })
    }
}