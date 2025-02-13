import { Model } from 'sequelize';

export default class ParticipantInConference extends Model {
    static initialize(sequelize) {
        ParticipantInConference.init(
            {},
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