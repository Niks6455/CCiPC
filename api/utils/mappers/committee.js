export function map(data){
    return {
        type: data.type,
        committees: data?.relatedData.map(r=> ({
          id: r?.id,
          committeeId: r?.committee.id,
          fio: r?.committee.fio,
          img: r?.committee.img,
          organization: r?.committee.organization,
        })) ?? null
    }
}