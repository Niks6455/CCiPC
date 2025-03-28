

export function mapShort(participant){
    return {
        name: participant?.name,
        surname: participant?.surname,
        patronymic: participant?.patronymic,
        organization: participant?.organization,
        phone: participant?.phone
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
        avatar: participant?.avatar[0].file.url ?? null,
        reports: participant?.conference?.reports?.map(report=>({
          name: report.name,
        })) ?? null,
        fee : participant?.conference?.participantInConference?.map(conf=>({
            sum: conf.sum,
            receipt: participant.receipt[0].file.url ?? null,
            accord: participant.accord[0].file.url ?? null,
            status: conf.status,
            formPay: conf.formPay,
        })) ?? null
    }
}