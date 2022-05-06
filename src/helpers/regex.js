const examples = [
	`SELECT NOME, DATANASCIMENTO, DESCRICAO, SALDOINICIAL FROM USUARIO JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO WHERE SALDOINICIAL >=235 AND UF ='CE' AND CEP <> '62930000';`,
	`SELECT IDUSUARIO, NOME, DATANASCIMENTO, DESCRICAO, SALDOINICIAL, UF, DESCRICAO FROM USUARIO JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO JOIN TIPOCONTA ON TIPOCONTA.IDTIPOCONTA = CONTAS.TIPOCONTA_IDTIPOCONTA ;`,
	'SELECT * FROM USUARIO;',
	'SELECT *A FROM USUARIO;',
	'SELECT A, FROM USUARIO;',
	'SELECT A,A FROM USUARIO;',
	'SELECT A,A FROM USUARIO;',
	' FROM USUARIO;',
	'* FROM USUARIO;',
	'* FROM USUARIO;',
	'SELECT * FROM USUARIO WHERE id = 1;',
	'SELECT * FROM USUARIO WHERE id <> 1;',
	'SELECT * FROM USUARIO WHERE id > 1;',
	'SELECT * FROM USUARIO WHERE id < 1;',
	'SELECT * FROM USUARIO WHERE id >= 1;',
	'SELECT * FROM USUARIO WHERE id <= 1;',
	'SELECT * FROM USUARIO WHERE id <= 1 AND id >= 3;',
	'SELECT * FROM USUARIO WHERE id <= 1 AND ;',
	'SELECT * FROM USUARIO WHERE id <= 1 AND;',
	'SELECT * FROM USUARIO WHERE id <= ;',
	'SELECT FROM USUARIO WHERE id <= ;',
	'SELECT * FROM USUARIO WHERE;',
	`SELECT * FROM USUARIO WHERE user = 'renatasasaso sdasasasaaasds addsd' AND X = 1;`,
	`SELECT * FROM USUARIO WHERE user = 'renato_ddsdasddsddasdsds';`,
	`SELECT NOME, DATANASCIMENTO, DESCRICAO, SALDOINICIAL FROM USUARIO JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO WHERE user = 'renato vdsdsadsddasdsdv SDSAD' DSD;`,
	`SELECT * FROM USUARIO WHERE user = 'renato vdsdsadsddasdsdv SDSAD' DSD;`,
	`SELECT * FROM USUARIO WHERE user = 'renato' AND;`,
	`SELECT * FROM USUARIO WHERE user='renato';`
];

//const chars2 = "([A-ZÇÃÚ0-9]+)(\\.?_?[A-ZÇÃÚ0-9]+)*"
//const chars2 = "([A-Za-zçãú0-9]+)(\\.?_?[A-Za-zçãú0-9]+)*"

//const chars2 = "A-Za-zÀ-ÖØ-öø-ÿ0-9"

const chars2 = '([A-ZÇÃÚ0-9._]+)';

const select = `SELECT ([*]|(${chars2}))(,\\s?${chars2})* FROM ${chars2}`;

const where = `WHERE ${chars2}\\s?((=|<=|<>|>=|<|>)\\s?((${chars2})|'(${chars2}\\s?)+'))( AND ${chars2}\\s?((=|<=|<>|>=|<|>)\\s?((${chars2})|'(${chars2}\\s?)+')))*`;

const join = `JOIN ${chars2} ON ${chars2}\\s?=\\s?${chars2}`;

const query = `^${select}\\s?(( ${where})?|( ${join})+?( ${where})?)?\\s?;$`;
//const query = `^${select}\\s?( ${where})\\s?;$`

export const regex = new RegExp(query);

/*const regexArray = [
	/,,+/i,                                          // Vírgulas seguidas
	/,\s? FROM/i,                                    // vírgula e/ou espaço antes do from
	/(\*\w|\w+\*)/i,                                 // Asterisco + Letra
	/\s{2,}/i,                                       // Mais de 1 espaço seguido
	/^(?!SELECT)/i,                                  // Sem SELECT
	/[^;]$/i,                                        // Sem ponto e vírgula no final
	/\w+\s AND (?!\w+)/i,                            // AND sem segundo operador
	/WHERE \w\s(=|<>|<|>|<=|>=)\s?(?!\w+)/i,         // Operadores de comparação sem segundo valor
]*/

examples.forEach((text) => {
	console.log(`Texto: ${text.toUpperCase()}`);
	console.log(`Resultados: [${text.toUpperCase().match(regex)}]`);
	console.log('--------------------------------------------------------');
});

console.log(regex);
