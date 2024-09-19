export const convertCurrency = (amount: string | number) => {
	return new Intl.NumberFormat('us-US', {
		style: 'currency',
		currency: '$',
	}).format(+amount)
}
