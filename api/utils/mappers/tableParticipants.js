export function mapShort(data){
    return {
       name: data?.report.name ?? null,
       direction: data?.report.direction ?? null,
       id: data?.report.id ?? null,
       organization: data?.organization ?? null,
       fio: data?.participants ?? null,
    }
}

export function map(data){
    return{
        ...mapShort(data),
        status: data.status ?? null,
    }
}
