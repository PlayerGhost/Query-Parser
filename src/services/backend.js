// export const removeWhitespaces = (text) => text.split(' ').filter((x) => x);

const text = `SELECT NOME, DATANASCIMENTO, DESCRICAO, SALDOINICIAL FROM USUARIO JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO WHERE SALDOINICIAL >=235 AND UF ='CE' AND CEP <> '62930000';`
const text2 = `SELECT IDUSUARIO, NOME, DATANASCIMENTO, DESCRICAO, SALDOINICIAL, UF, DESCRICAO FROM USUARIO JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO JOIN TIPOCONTA ON TIPOCONTA.IDTIPOCONTA = CONTAS.TIPOCONTA_IDTIPOCONTA ;`

const examples = [
    `SELECT NOME, DATANASCIMENTO, DESCRICAO, SALDOINICIAL FROM USUARIO JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO WHERE SALDOINICIAL >=235 AND UF ='CE' AND CEP <> '62930000';`,
    `SELECT IDUSUARIO, NOME, DATANASCIMENTO, DESCRICAO, SALDOINICIAL, UF, DESCRICAO FROM USUARIO JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO JOIN TIPOCONTA ON TIPOCONTA.IDTIPOCONTA = CONTAS.TIPOCONTA_IDTIPOCONTA ;`,
    'SELECT * FROM USUARIO;',
    'SELECT *A FROM USUARIO;',
    'SELECT A, FROM USUARIO;',
    'SELECT A,A FROM USUARIO;',
    'SELECT A,A FROM USUARIO',
    ' FROM USUARIO;',
    '* FROM USUARIO;',
    '* FROM USUARIO',
    'select * FROM USUARIO where id = 1;',
    'select * FROM USUARIO where id <> 1;',
    'select * FROM USUARIO where id > 1;',
    'select * FROM USUARIO where id < 1;',
    'select * FROM USUARIO where id >= 1;',
    'select * FROM USUARIO where id <= 1;',
    'select * FROM USUARIO where id <= 1 and id >= 3;',
    'select * FROM USUARIO where id <= 1 and ;',
    'select * FROM USUARIO where id <= 1 and;',
    'select * FROM USUARIO where id <= ;',
]


// const where = /WHERE [\w]+\s?(((=|<=|<>|>=|<|>)\s?[\w]+)|((IN|NOT IN) [(][\w]+(,\s?[\w]+)+[)]))( AND [\w]+\s?(((=|<=|<>|>=|<|>)\s?[\w]+)|((IN|NOT IN) [(][\w]+(,\s?[\w]+)+[)])))*$/

// const join = /(JOIN [\w]+ ON [\w.]+\s?=\s?[\w.]+)+$/

// const regex = /^SELECT ([*]|([\w]+))(,\s?[\w]+)* FROM [\w]+\s?(( WHERE [\w]+\s?(((=|<=|<>|>=|<|>)\s?[\w '"]+)|((IN|NOT IN) [(][\w '"]+(,\s?[\w "']+)+[)]))( AND [\w]+\s?(((=|<=|<>|>=|<|>)\s?[\w '"]+)|((IN|NOT IN) [(][\w '"]+(,\s?[\w '"]+)+[)])))*)|( JOIN [\w]+ ON [\w.]+\s?=\s?[\w.]+)+( WHERE [\w]+\s?(((=|<=|<>|>=|<|>)\s?[\w '"]+)|((IN|NOT IN) [(][\w '"]+(,\s?[\w '"]+)+[)]))( AND [\w]+\s?(((=|<=|<>|>=|<|>)\s?[\w '"]+)|((IN|NOT IN) [(][\w '"]+(,\s?[\w '"]+)+[)])))*)?)?\s?;$/


// console.log(text)
// console.log(text.match(regex))

// console.log(text2)
// console.log(text2.match(regex))

const regexArray = [
    /,,+/i,                                          // Vírgulas seguidas
    /,\s? FROM/i,                                    // vírgula e/ou espaço antes do from
    /(\*\w|\w+\*)/i,                                 // Asterisco + Letra
    /\s{2,}/i,                                       // Mais de 1 espaço seguido
    /^(?!select)/i,                                  // Sem select
    /[^;]$/i,                                        // Sem ponto e vírgula no final
    /\w+\s and (?!\w+)/i,                            // AND sem segundo operador
    /where \w\s(=|<>|<|>|<=|>=)\s?(?!\w+)/i,         // Operadores de comparação sem segundo valor
]

examples.forEach(text => {
    console.log(`Texto: ${text}`)
    console.log(`Resultados: [${regexArray.map(r => Boolean(text.match(r)))}]`)
    console.log("--------------------------------------------------------")
})
