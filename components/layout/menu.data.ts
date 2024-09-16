export interface IMenuItem {
	name: string
	url: string
	icon: string
}

export const MENU_DATA: IMenuItem[] = [
	{
		icon: 'radix-icons:dashboard',
		name: 'Dashboard',
		url: '/',
	},
	{
		name: 'Products',
		icon: 'ep:goods',
		url: '/products',
	},
	{
		name: 'Orders',
		icon: 'fluent:receipt-28-regular',
		url: '/orders',
	},
	{
		name: 'Team',
		icon: 'mingcute:group-line',
		url: '/team',
	},
	{
		name: 'Customers',
		icon: 'mingcute:group-line',
		url: '/customers',
	},
	{
		name: 'Settings',
		icon: 'radix-icons:gear',
		url: '/settings',
	},
	{
		name: 'Help center',
		icon: 'radix-icons:question-mark',
		url: '/help',
	},
]
