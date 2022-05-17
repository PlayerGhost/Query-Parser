export const removeWhitespaces = (text) => {
	return text
		.replaceAll(',', ',\ ')
		.replaceAll(',\ {2,}', ', ')
		.replaceAll('\ {2,}', '');
};