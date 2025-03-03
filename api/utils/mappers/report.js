export function map(report){
    return {
        name: report.name,
        comment: report.comment,
        reportFile : report.reportFile ?? null,
        conclusion: report.conclusion ?? null,
        direction: report.direction,
        cacheCoAuthors: report.cacheCoAuthors ?? 0,
        author: report?.participantOfReport.filter(p=> p.who === 'Автор').map(p=>({
            id: p.id,
            form: p.form,
            organization: p.organization,
            status: p.status,
            email: p.participant.email,
            phone: p.participant.phone,
            fio: `${p.participant.surname} ${p.participant.name} ${p.participant?.patronymic}`.trim(),
        }))[0],
        coAuthors: report?.participantOfReport.filter(p=> p.who === 'Соавтор').map(p=>({
            id: p.id,
            form: p.form,
            organization: p.organization,
            status: p.status,
            email: p.participant.email,
            phone: p.participant.phone,
            fio: `${p.participant.surname} ${p.participant.name} ${p.participant?.patronymic}`.trim(),
        })),
    }
}