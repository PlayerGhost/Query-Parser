export const removeWhitespaces = (text) => text.split(' ').filter((x) => x);

// TODO Passar texto para maiúsculo antes de verificar pelo regex

const text = "Select nome, datanascimento, descricao, saldoinicial from usuario join contas on usuario.idUsuario = contas.Usuario_idUsuario where saldoinicial >=235 and uf ='ce' and cep <> '62930000';".toUpperCase()

const text2 = "Select idusuario, nome, datanascimento, descricao, saldoinicial, UF, descricao from usuario join contas on usuario.idUsuario = contas.Usuario_idUsuario join tipoconta on tipoconta.idTipoConta = contas.TipoConta_idTipoConta ;".toUpperCase()


const where = /WHERE [\w]+\s?(((=|<=|<>|>=|<|>)\s?[\w]+)|((IN|NOT IN) [(][\w]+(,\s?[\w]+)+[)]))( AND [\w]+\s?(((=|<=|<>|>=|<|>)\s?[\w]+)|((IN|NOT IN) [(][\w]+(,\s?[\w]+)+[)])))*$/

const join = /(JOIN [\w]+ ON [\w.]+\s?=\s?[\w.]+)+$/

const regex = /^SELECT ([*]|([\w]+))(,\s?[\w]+)* FROM [\w]+\s?(( WHERE [\w]+\s?(((=|<=|<>|>=|<|>)\s?[\w '"]+)|((IN|NOT IN) [(][\w '"]+(,\s?[\w "']+)+[)]))( AND [\w]+\s?(((=|<=|<>|>=|<|>)\s?[\w '"]+)|((IN|NOT IN) [(][\w '"]+(,\s?[\w '"]+)+[)])))*)|( JOIN [\w]+ ON [\w.]+\s?=\s?[\w.]+)+( WHERE [\w]+\s?(((=|<=|<>|>=|<|>)\s?[\w '"]+)|((IN|NOT IN) [(][\w '"]+(,\s?[\w '"]+)+[)]))( AND [\w]+\s?(((=|<=|<>|>=|<|>)\s?[\w '"]+)|((IN|NOT IN) [(][\w '"]+(,\s?[\w '"]+)+[)])))*)?)?\s?;$/


console.log(text)
console.log(text.match(regex))

console.log(text2)
console.log(text2.match(regex))


//Ainda com alguns problemas(caracteres especiais), mas ta quase

