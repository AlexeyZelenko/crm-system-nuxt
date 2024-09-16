import type {EnumStatus} from '~/types/deals.types'
import {array} from "yup";

export interface ICard {
	id: string
	name: string
	description: string
	priority: string
	executants: string[]
	owner: string
	$createdAt: string
	companyName: string
	status: string
}

export interface IColumn {
	id: EnumStatus
	name: string
	items: ICard[]
}
