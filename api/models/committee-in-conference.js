import { Model } from 'sequelize';

export default class CommitteeInConference extends Model {
    static initialize(sequelize) {
        CommitteeInConference.init(
            {},
            {
                sequelize,
                schema: process.env.NODE_ENV,
                modelName: 'CommitteeInConference',
                tableName: 'committee-In-conference',
                timestamps: false,
            }
        );
    }
}