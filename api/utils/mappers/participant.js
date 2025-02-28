

export function mapShort(participant){
    return {
        name: participant.name,
        surname: participant.surname,
        patronymic: participant?.patronymic,
        organization: participant.organization,
        phone: participant.phone
    }
}

export function map(participant){
    return {
        name: participant.name,
        surname: participant.surname,
        patronymic: participant?.patronymic,
        academicTitle: participant.academicTitle,
        degree: participant.degree,
        position: participant.position,
        organization: participant.organization,
        phone: participant.phone,
        reports: participant?.reports.map(report=>({
          name: report.name,
        }))
    }
}