import {DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default class ParticipantInConference extends Model {
    static initialize(sequelize) {
        ParticipantInConference.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true },
                formPay: {type: DataTypes.ENUM('Безналичный', 'Наличный', 'Не выбран'), allowNull: true, defaultValue: 'Не выбран'},
                sum: {type: DataTypes.INTEGER, allowNull: true},
                status : { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false},
                comment: { type: DataTypes.STRING, allowNull: true },
                receipt: { type: DataTypes.STRING, allowNull: true },
                agreement: { type: DataTypes.STRING, allowNull: true },
            },
            {
                sequelize,
                schema: process.env.NODE_ENV,
                modelName: 'ParticipantInConference',
                tableName: 'participants-In-conferences',
                timestamps: false,
            }
        );

        ParticipantInConference.beforeCreate(c => {
            c.id = uuidv4();
        });

        ParticipantInConference.beforeBulkCreate(c=>{
            for (const participantInConference of c) {
                participantInConference.id=uuidv4()
            }
        })
    }
}