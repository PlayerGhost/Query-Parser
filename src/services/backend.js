export const removeWhitespaces = (text) => text.split(' ').filter((x) => x);

// TODO Passar texto para maiúsculo antes de verificar pelo regex
const operatorRegex = /(=|<=|<>|>=|<|>|AND|IN|NOT IN)/;
