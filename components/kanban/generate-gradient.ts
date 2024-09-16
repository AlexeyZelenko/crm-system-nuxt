export const generateColumnStyle = (index: string | number, total = 1) => {
	// @ts-ignore
	const intensity = 100 - (index / (total - 1)) * 50
	// оттенок, насыщенность, светлость
	return { backgroundColor: `hsla(280, 52%, ${intensity}%, 30%)` }
}
