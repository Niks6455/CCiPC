

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
        email: participant.email,
        degree: participant.degree,
        position: participant.position,
        organization: participant.organization,
        phone: participant.phone,
        avatar: participant?.avatar ?? null,
        reports: participant?.reports?.map(report=>({
          name: report.name,
        })) ?? null
    }
}