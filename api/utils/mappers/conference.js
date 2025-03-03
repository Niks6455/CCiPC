export function map(data){
    return {
        id: data.id,
        number: data.number,
        date: data.date,
        address: data.address,
        state: data.state,
        stages: data.stages,
        organization: data.organization,
        partner: data.partner,
        logo: data.logo,
        documents: data.documents,
        directions: data.directions,
        deadline: data.deadline,
        committee: data?.committee ?? null,
        description: data?.description ?? null,
    }
}