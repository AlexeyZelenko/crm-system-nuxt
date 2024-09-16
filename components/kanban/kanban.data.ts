import {EnumStatus} from '~/types/deals.types'
import type {IColumn} from './kanban.types'

export const KANBAN_DATA: IColumn[] = [
	{
		id: EnumStatus.todo,
		name: 'To Do',
		items: [],
	},
	{
		id: EnumStatus['to-be-agreed'],
		name: 'Approval',
		items: [],
	},
	{
		id: EnumStatus['in-progress'],
		name: 'In Progress',
		items: [],
	},
	{
		id: EnumStatus.produced,
		name: 'Review',
		items: [],
	},
	{
		id: EnumStatus.done,
		name: 'Completed',
		items: [],
	},
]
