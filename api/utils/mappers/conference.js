
export function map(data){
    return {
        id: data.id,
        number: data.number,
        date: data.date,
        address: data.address,
        state: data.state,
        stages: data.stages,
        organization: data?.organization.map(d=>({id: d.id, url: d.url, index: d.index, file: d.collaboratorFile.file.url})),
        partner: data?.partner.map(d=>({id: d.id, url: d.url, index: d.index, file: d.collaboratorFile.file.url})),
        logo: data.logo,
        documents: data.documents,
        directions: data?.directions ?? null,
        deadline: data.deadline,
        committee: data?.committee ?? null,
        description: data?.description ?? null,
        files: data?.files ?? null,
    }
}