export interface IBaseField {
    $createdAt: string
    $id: string
}

export interface ICustomer extends IBaseField {
    name: string
    email: string
    avatar_url: string,
    position: string,
    role: string,
    from_source?: string
    id?: string
}