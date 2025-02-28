export function map(data){
    return {
        id: data.id,
        number: data.number,
        date: data.date,
        address: data.address,
        state: data.state,
        organization: data.organization,
        partner: data.partner,
        logo: data.logo,
        documents: data.documents,
        directions: data.directions,
        committee: data?.committee ?? null
    }
}