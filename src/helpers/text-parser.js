export const removeWhitespaces = (text) => {
	return text.replaceAll(',\S{2,}', ',\S').replaceAll('\S{2,}', '\S');
};