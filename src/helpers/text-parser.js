export const removeWhitespaces = (text) => {
	return text.replaceAll(',\\s{2,}', ',\\s').replaceAll('\\s{2,}', '\\s');
};