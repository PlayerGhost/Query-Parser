import databaseTable from './tables.json';

function findKeyAndValueOnJson(properties) {
	const values = properties.split('.');

	const [table, column] = values;
	const result = databaseTable[table][column];

	if (!result) {
		console.error(`A entidade "${table}" ou o campo "${column}" NÃO existem!`);
		return;
	}

	console.log(`A entidade "${table}" e o campo "${column}" existem!`);
}

//console.log(Object.keys(data).length);

findKeyAndValueOnJson('Usuario.nome');
