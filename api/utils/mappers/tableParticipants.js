export function mapShort(data){
    return {
        fio: [ `${data.name} ${data.surname} ${data?.patronymic ? data.patronymic: ''}`.trim(),  ...(data?.reports[0]?.coAuthors ? Object.values(data?.reports[0]?.coAuthors)
            .map(c=>`${c.name} ${c.surname} ${c?.patronymic ? c.patronymic : ''}`.trim()) : [])],
        organization: data.participantOfReport.organization ?? null,
        id: data.id,
        direction: data?.reports[0].direction ?? null,
        report: data?.reports[0].name ?? null
    }
}

export function map(data){
    return{
        ...mapShort(data),
        status: data?.reports[0].status ?? null,
    }
}
