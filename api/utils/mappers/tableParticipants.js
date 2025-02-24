export function map(data){
    return {
        fio: [ `${data.name} ${data.surname} ${data?.patronymic ? data.patronymic: ''}`.trim(),  ...(data?.reports[0]?.coAuthors ? Object.values(data?.reports[0]?.coAuthors)
            .map(c=>`${c.name} ${c.surname} ${c?.patronymic ? c.patronymic : ''}`.trim()) : [])],
        organization: data.organization,
        direction: data?.reports[0].direction ?? null,
        report: data?.reports[0].name ?? null
    }
}