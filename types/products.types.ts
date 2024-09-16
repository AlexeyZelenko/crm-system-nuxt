export interface IBaseField {
    $createdAt: string
    $id: string
}

export interface IProduct extends IBaseField {
    name: string
    description: string
    client: string
    deadline: any
    status: string
    lead: string
}