import { models } from './index.js';
const { Participant, Report, Conference, ParticipantInConference, File, FileLink, Committee, CommitteeInConference } = models;

export default function () {
    Conference.belongsToMany(Participant, {
        through: ParticipantInConference,
        foreignKey: { name: 'conferenceId', allowNull: false},
        as: 'participants',

    });
    Participant.belongsToMany(Conference, {
        through: ParticipantInConference,
        foreignKey: { name: 'participantId', allowNull: false},
        as: 'conferences',
    });


    Participant.hasMany(ParticipantInConference, {
        as: 'participantInConference',
        foreignKey: { name: 'participantId', allowNull: false }
    });


    Conference.hasMany(ParticipantInConference, {
        as: 'participantInConference',
        foreignKey: { name: 'conferenceId', allowNull: false }
    });


    ParticipantInConference.belongsTo(Participant, {
        as: 'participant',
        foreignKey: { name: 'participantId', allowNull: false }
    });


    ParticipantInConference.belongsTo(Conference, {
        as: 'conference',
        foreignKey: { name: 'conferenceId', allowNull: false }
    });














    Committee.hasMany(CommitteeInConference, {
        as: 'committeeInConference',
        foreignKey: { name: 'committeeId', allowNull: false }
    });


    Conference.hasMany(CommitteeInConference, {
        as: 'committeeInConference',
        foreignKey: { name: 'conferenceId', allowNull: false }
    });





    Conference.belongsToMany(Committee, {
        through: CommitteeInConference,
        foreignKey: { name: 'conferenceId', allowNull: false},
        as: 'committees',

    });
    Committee.belongsToMany(Conference, {
        through: CommitteeInConference,
        foreignKey: { name: 'committeeId', allowNull: false},
        as: 'conferences',
    });



    CommitteeInConference.belongsTo(Committee, {
        as: 'committee',
        foreignKey: { name: 'committeeId', allowNull: false }
    });


    CommitteeInConference.belongsTo(Conference, {
        as: 'conference',
        foreignKey: { name: 'conferenceId', allowNull: false }
    });


    File.hasOne(FileLink, {foreignKey: {name: 'fileId', allowNull: false}, as: 'file'});
    Conference.hasOne(FileLink, {foreignKey: {name: 'conferenceId', allowNull: true}, as: 'conference'});
    Report.hasOne(FileLink, {foreignKey: {name: 'reportId', allowNull: true}, as: 'report'});
    Participant.hasOne(FileLink, {foreignKey: {name: 'participantId', allowNull: true}, as: 'participant'});

    Participant.hasMany(Report, { foreignKey: { name: 'participantId', allowNull: true }, as: 'reports' });
    Report.belongsTo(Participant, { foreignKey: { name: 'participantId', allowNull: true }, as: 'participant' });

    Conference.hasMany(Report, { foreignKey: { name: 'conferenceId', allowNull: true }, as: 'reports' });
    Report.belongsTo(Conference, { foreignKey: { name: 'conferenceId', allowNull: true }, as: 'conference' });

}