import { databaseTable } from './db.js';

export function findKeyAndValueOnJson(properties) {
	const values = properties.split('.');

	const [table, column] = values;
	const result = databaseTable[table][column];

	if (!result) {
		console.error(`A entidade "${table}" ou o campo "${column}" NÃO existem!`);
		return;
	}

	console.log(`A entidade "${table}" e o campo "${column}" existem!`);
}

export function validateAttributes(tables, columns) {
	if (!validateTables(tables)) {
		console.error('nao tem todas as tabelas !!!!');
		return false;
	}

	if (!validateColumns(tables, columns)) {
		console.error('nao tem todos os atributos!!!!');
		return false;
	}

	return true;
}

export function getAttributesFromTable(table) {
	if (!validateTables([table])) {
		throw new Error('Não existe essa tabela no banco de dados');
	}

	return { [table]: databaseTable[table] };
}

function validateTables(tables) {
	const checkIfTableExists = (y, x) => y && x in databaseTable;
	return tables.reduce(checkIfTableExists, true);
}

function validateColumns(tables, columns) {
	const columnsToCheck = tables.reduce((y, x) => {
		return y.concat(databaseTable[x]);
	}, []);

	const checkIfColumnExists = (y, x) => y && columnsToCheck.includes(x);
	return columns.reduce(checkIfColumnExists, true);
}
console.log(Object.keys(databaseTable).length);

findKeyAndValueOnJson('Usuario.Nome');
const tables = ['Usuario']
const columns = ['idUsuario']
validateAttributes(tables, columns)
