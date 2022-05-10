export const databaseTable = {
	"USUARIO": [
		"IDUSUARIO",
		"NOME",
		"LOGRADOURO",
		"NÚMERO",
		"BAIRRO",
		"CEP",
		"UF",
		"DATANASCIMENTO"
	],
	"CONTAS": [
		"IDCONTA",
		"DESCRICAO",
		"TIPOCONTA_IDTIPOCONTA",
		"USUARIO_IDUSUARIO",
		"SALDOINICIAL"
	],
	"TIPOCONTA": [
		"IDTIPOCONTA",
		"DESCRIÇÃO"
	],
	"MOVIMENTACAO": [
		"IDMOVIMENTAÇÃO",
		"DATAMOVIMENTACAO",
		"DESCRICAO",
		"TIPOMOVIMENTO_IDTIPOMOVIMENTO",
		"CATEGORIA_IDCATEGORIA",
		"CONTAS_IDCONTAS",
		"VALOR"
	],
	"TIPOMOVIMENTO": [
		"IDTIPOMOVIMENTO",
		"DESCMOVIMENTACAO"
	],
	"CATEGORIA": [
		"IDCATEGORIA",
		"DESCCATEGORIA"
	]
}

export function getTableFromAtt(att){
	for(let table in databaseTable){
		let value = att.toUpperCase()
		if(databaseTable[table].includes(value)){
			return table
		}
	}
}

console.log(getTableFromAtt('idCategoria'))
