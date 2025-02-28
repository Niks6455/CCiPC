import {DataTypes, Model, Sequelize} from 'sequelize';

export default class ParticipantInConference extends Model {
    static initialize(sequelize) {
        ParticipantInConference.init(
            {
                formPay: {type: DataTypes.ENUM('Безналичный', 'Наличный'), allowNull: true},
                sum: {type: DataTypes.INTEGER, allowNull: true},
                status : { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false},
                comment: { type: DataTypes.STRING, allowNull: true },
                agreement: { type: DataTypes.STRING, allowNull: true },
                receipt: { type: DataTypes.STRING, allowNull: true },
            },
            {
                sequelize,
                schema: process.env.NODE_ENV,
                modelName: 'ParticipantInConference',
                tableName: 'participants-In-conferences',
                timestamps: false,
            }
        );
    }
}