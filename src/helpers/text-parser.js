export const removeWhitespaces = (text) => {
	const filterWhitespaceRegex = new RegExp(/\ {2,}/, 'g')
	return text.replaceAll(filterWhitespaceRegex, ` `)
};