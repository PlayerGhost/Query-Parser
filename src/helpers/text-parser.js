export const removeWhitespaces = (text) => {
    return text
        .split(' ')
        .filter((x) => x)
        .join(' ')
}

export const parseCommaWhitespaces = (text) => {
    return text.sub(',\s{2,}', ',\s')
}