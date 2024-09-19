export interface IBaseField {
	$createdAt: string
	$id: string
}

export interface ICustomer extends IBaseField {
	name: string
	email: string
	avatar_url: string
	from_source?: string
}

export interface IComment extends IBaseField {
	text: string
}

export enum EnumStatus {
	'todo' = 'todo',
	'to-be-agreed' = 'to-be-agreed',
	'in-progress' = 'in-progress',
	'produced' = 'produced',
	'done' = 'done',
}

export interface IDeal extends IBaseField {
	comments?: IComment[]
	customer?: ICustomer
	name: string
	description: string
	priority: string
	executants: any[]
	owner: string
	status: EnumStatus
}

export interface IMember extends IBaseField {
	name: string
	email: string
	avatar_url: string,
	position: string,
	role: string,
	from_source?: string
	id?: string
}

